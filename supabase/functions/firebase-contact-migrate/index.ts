import "https://deno.land/x/xhr@0.4.0/mod.ts";
import { serve } from "https://deno.land/std@0.223.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function base64url(input: Uint8Array): string {
  let str = btoa(String.fromCharCode(...input));
  return str.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function getGoogleAccessToken(serviceAccountJson: string): Promise<string> {
  const svc = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: svc.client_email,
    scope: "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/userinfo.email",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const enc = new TextEncoder();
  const headerB64 = base64url(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64url(enc.encode(JSON.stringify(payload)));
  const unsigned = `${headerB64}.${payloadB64}`;

  const key = await importPrivateKey(svc.private_key);
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc.encode(unsigned)),
  );
  const jwt = `${unsigned}.${base64url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to obtain Google access token: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

async function fetchFirestoreDoc(accessToken: string, projectId: string, path: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) return null;
  return await res.json();
}

function extractStringsFromFirestoreDoc(doc: any): Record<string, string> {
  const out: Record<string, string> = {};
  const fields = doc?.fields || {};
  for (const [k, v] of Object.entries<any>(fields)) {
    if (v?.stringValue) out[k] = v.stringValue;
    if (v?.integerValue) out[k] = String(v.integerValue);
    if (v?.doubleValue) out[k] = String(v.doubleValue);
    if (v?.booleanValue !== undefined) out[k] = String(v.booleanValue);
  }
  return out;
}

function pickContactInfo(raw: Record<string, string>) {
  const picked: Record<string, string> = {};
  const entries = Object.entries(raw);
  for (const [k, val] of entries) {
    const key = k.toLowerCase();
    if (key.includes("phone") || key.includes("whatsapp")) picked[k] = val;
    if (key.includes("email")) picked[k] = val;
    if (key.includes("address")) picked[k] = val;
    if (key.includes("emergency")) picked[k] = val;
  }
  return picked;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIREBASE_SERVICE_ACCOUNT_JSON = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON");
    if (!FIREBASE_SERVICE_ACCOUNT_JSON) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON secret");
    }
    const svc = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON);
    const projectId: string = svc.project_id;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { paths: bodyPaths } = (await req.json().catch(() => ({ paths: [] }))) as { paths?: string[] };
    const candidatePaths = bodyPaths && bodyPaths.length ? bodyPaths : [
      "settings/contact",
      "config/contact",
      "site/contact",
      "public/contact",
      "meta/contact",
      "app/contact",
      "contact",
    ];

    const accessToken = await getGoogleAccessToken(FIREBASE_SERVICE_ACCOUNT_JSON);

    let foundDoc: any = null;
    let usedPath = "";
    for (const p of candidatePaths) {
      const d = await fetchFirestoreDoc(accessToken, projectId, p);
      if (d && d.fields) {
        foundDoc = d;
        usedPath = p;
        break;
      }
    }

    if (!foundDoc) {
      return new Response(JSON.stringify({ ok: false, message: "No contact document found in candidate paths", tried: candidatePaths }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const raw = extractStringsFromFirestoreDoc(foundDoc);
    const contact = pickContactInfo(raw);

    // Fetch active location_info row (create if missing)
    const { data: existing, error: fetchErr } = await supabase
      .from("location_info")
      .select("id, contact_info")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();
    if (fetchErr) throw fetchErr;

    let id = existing?.id as string | undefined;
    let current = (existing?.contact_info as Record<string, unknown>) || {};

    if (!id) {
      const { data: inserted, error: insertErr } = await supabase
        .from("location_info")
        .insert([{ title: "Location Info", is_active: true, contact_info: {}, description: null, address: null, coordinates: null }])
        .select("id")
        .single();
      if (insertErr) throw insertErr;
      id = inserted.id;
      current = {};
    }

    const updated = { ...current, ...contact, source: "firebase" };

    const { error: updateErr } = await supabase
      .from("location_info")
      .update({ contact_info: updated })
      .eq("id", id);
    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ ok: true, path: usedPath, migrated_keys: Object.keys(contact), location_info_id: id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("firebase-contact-migrate error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
