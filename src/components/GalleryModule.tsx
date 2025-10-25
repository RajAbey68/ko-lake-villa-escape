// src/components/GalleryModule.tsx
// One-file Gallery module: PublicGallery + AdminGallery + Supabase helpers.
// React + Vite, storage-only (no DB tables). Shows image & video thumbnails.
// Requirements: @supabase/supabase-js; VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY set.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** ------- Config (override via props if you want) ------- */
const DEFAULT_BUCKET = "gallery";
const DEFAULT_PREFIX = "images/";

/** ------- Types ------- */
type Kind = "image" | "video" | "unknown";
type GalleryItem = {
  id: string;       // full storage path e.g. images/123_name.jpg
  name: string;     // filename
  url: string;      // public (or signed) URL
  createdAt?: string | null;
  kind: Kind;
};

/** ------- Internal helpers (in-file singletons) ------- */
let _sb: SupabaseClient | null = null;
function sb(): SupabaseClient {
  if (_sb) return _sb!;
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  if (!url || !anon) {
    throw new Error("Missing env: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }
  _sb = createClient(url, anon);
  return _sb!;
}

function inferKind(filename: string): Kind {
  const n = filename.toLowerCase();
  if (/\.(jpg|jpeg|png|webp|avif|gif)$/i.test(n)) return "image";
  if (/\.(mp4|webm|ogg|mov)$/i.test(n)) return "video";
  return "unknown";
}

async function listFiles(bucket: string, prefix: string, limit = 200, offset = 0): Promise<GalleryItem[]> {
  const { data, error } = await sb()
    .storage.from(bucket)
    .list(prefix, { limit, offset, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw error;

  return (data ?? [])
    .filter((e) => e?.name) // ignore folders
    .map((e) => {
      const path = `${prefix}${e.name}`;
      const url = sb().storage.from(bucket).getPublicUrl(path).data?.publicUrl ?? "";
      return {
        id: path,
        name: e.name!,
        url,
        createdAt: (e as any)?.created_at ?? null,
        kind: inferKind(e.name!),
      };
    });
}

async function uploadFile(bucket: string, prefix: string, file: File): Promise<GalleryItem> {
  const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const path = `${prefix}${safeName}`;
  const { error } = await sb().storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });
  if (error) throw error;
  const url = sb().storage.from(bucket).getPublicUrl(path).data?.publicUrl ?? "";
  return { id: path, name: safeName, url, createdAt: new Date().toISOString(), kind: inferKind(safeName) };
}

async function deleteFile(bucket: string, id: string) {
  const { error } = await sb().storage.from(bucket).remove([id]);
  if (error) throw error;
}

/** ------- Public Gallery (read-only masonry) ------- */
export function PublicGallery(props: {
  bucket?: string;
  prefix?: string;
  title?: string;
}) {
  const bucket = props.bucket ?? DEFAULT_BUCKET;
  const prefix = props.prefix ?? DEFAULT_PREFIX;

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const title = props.title ?? "Gallery";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await listFiles(bucket, prefix);
        setItems(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [bucket, prefix]);

  if (loading) return <p style={{ padding: "16px" }}>Loading gallery…</p>;

  return (
    <section className="container" style={{ padding: "32px 16px" }}>
      <h2 style={{ margin: 0, fontSize: 28 }}>{title}</h2>
      <div style={{ marginTop: 16, columnCount: 3, columnGap: 10 }}>
        {items.map((it) => (
          <figure
            key={it.id}
            style={{
              breakInside: "avoid",
              margin: 0,
              marginBottom: 10,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--line)",
            }}
          >
            {it.kind === "image" && (
              <img src={it.url} alt={it.name} style={{ width: "100%", height: "auto", display: "block" }} />
            )}
            {it.kind === "video" && (
              <video
                src={it.url}
                muted
                controls
                preload="metadata"
                style={{ width: "100%", height: "auto", display: "block", background: "#000" }}
              />
            )}
            {it.kind === "unknown" && (
              <div
                style={{
                  width: "100%",
                  height: 200,
                  display: "grid",
                  placeItems: "center",
                  background: "#f1f5f9",
                }}
              >
                <span className="muted" style={{ fontSize: 12 }}>
                  Unknown file
                </span>
              </div>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

/** ------- Admin Gallery (list, multi-upload, delete) ------- */
export function AdminGallery(props: {
  bucket?: string;
  prefix?: string;
  title?: string;
}) {
  const bucket = props.bucket ?? DEFAULT_BUCKET;
  const prefix = props.prefix ?? DEFAULT_PREFIX;
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const title = props.title ?? "Gallery Admin";

  const refresh = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await listFiles(bucket, prefix);
      setItems(data);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, [bucket, prefix]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const browse = useCallback(() => inputRef.current?.click(), []);

  const onFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;
      setBusy(true);
      setErr(null);
      try {
        for (const f of files) {
          const created = await uploadFile(bucket, prefix, f);
          setItems((prev) => [created, ...prev]); // optimistic prepend
        }
      } catch (e: any) {
        setErr(e?.message ?? String(e));
      } finally {
        setBusy(false);
        e.target.value = ""; // allow re-uploading same name
      }
    },
    [bucket, prefix]
  );

  const onDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this item from the gallery?")) return;
      setBusy(true);
      setErr(null);
      try {
        await deleteFile(bucket, id);
        setItems((prev) => prev.filter((x) => x.id !== id));
      } catch (e: any) {
        setErr(e?.message ?? String(e));
      } finally {
        setBusy(false);
      }
    },
    [bucket]
  );

  return (
    <section className="container" style={{ padding: "24px 16px" }}>
      <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
      <p className="muted" style={{ marginTop: 6 }}>
        Bucket <code>{bucket}</code> / Prefix <code>{prefix}</code> (public read recommended)
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn btn-primary" onClick={browse} disabled={busy}>
          Upload images / videos
        </button>
        <button className="btn btn-ghost" onClick={() => refresh()} disabled={busy || loading}>
          Refresh
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={onFiles}
        />
      </div>

      {err && (
        <div className="card" style={{ marginTop: 12, color: "#b42318", borderColor: "#fecaca" }}>
          Error: {err}
        </div>
      )}
      {loading ? <p style={{ marginTop: 16 }}>Loading…</p> : null}

      <ul
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
          padding: 0,
          listStyle: "none",
        }}
      >
        {items.map((it) => (
          <li key={it.id} className="card" style={{ padding: 8 }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 140,
                overflow: "hidden",
                borderRadius: 12,
                border: "1px solid var(--line)",
              }}
            >
              {it.kind === "image" && (
                <img
                  src={it.url}
                  alt={it.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              )}
              {it.kind === "video" && (
                <video
                  src={it.url}
                  muted
                  controls={false}
                  preload="metadata"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", background: "#000" }}
                />
              )}
              {it.kind === "unknown" && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    background: "#f1f5f9",
                  }}
                >
                  <span className="muted" style={{ fontSize: 12 }}>
                    Unknown file
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <span
                className="muted"
                style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                title={it.name}
              >
                {it.name}
              </span>
              <button className="btn btn-ghost" onClick={() => onDelete(it.id)} disabled={busy}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
