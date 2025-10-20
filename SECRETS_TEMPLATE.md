# Ko Lake Villa - Complete Secrets Configuration

**Date:** October 19, 2025  
**Purpose:** Unified secrets template for Replit → Local → Supabase deployment

---

## 🎯 Secrets Architecture

Your project uses **TWO separate secret stores**:

1. **Frontend (Vite)** - `.env` file → Variables prefixed with `VITE_`
2. **Backend (Supabase Edge Functions)** - Supabase Secrets → Accessed via `Deno.env.get()`

---

## 📋 Complete Secrets List

### **Expected Secrets from Replit:**

Based on your edge functions, here are ALL the secrets your project needs:

```bash
# ========================================
# SUPABASE CREDENTIALS (✅ Already Found)
# ========================================
VITE_SUPABASE_URL=https://zctpyveoakvbrrjmviqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDgyMTMsImV4cCI6MjA3MTcyNDIxM30.rgB4Cy_ktvQ9Dq0KmpX7IrM5vVqZW4HgtwiqulkV3Rg

# Backend only (service role - NEVER expose to frontend)
SUPABASE_URL=https://zctpyveoakvbrrjmviqg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>

# ========================================
# GUESTY API (❓ Need from Replit)
# ========================================
# Frontend
VITE_GUESTY_API_KEY=<your_guesty_api_key>
VITE_GUESTY_BASE_URL=https://api.guesty.com/v1

# Backend (OAuth credentials)
GUESTY_CLIENT_ID=<your_guesty_client_id>
GUESTY_CLIENT_SECRET=<your_guesty_client_secret>
GUESTY_API_KEY=<your_guesty_api_key>
GUESTY_BASE_URL=https://api.guesty.com/v1
GUESTY_LISTING_ID=<your_property_listing_id>

# ========================================
# OPENAI API (❓ Need from Replit)
# ========================================
OPENAI_API_KEY=<sk-proj-xxxxx>

# ========================================
# FIREBASE (Optional - for migration only)
# ========================================
FIREBASE_SERVICE_ACCOUNT_JSON=<firebase_json_if_you_have_it>
```

---

## 🔍 Which Edge Functions Need Which Secrets?

| Edge Function | Required Secrets |
|---------------|------------------|
| `ai-assistant` | `OPENAI_API_KEY` (via APP_CONFIG_JSON) |
| `booking-processor` | `GUESTY_API_KEY`, `GUESTY_LISTING_ID`, `GUESTY_BASE_URL` (via APP_CONFIG_JSON) |
| `guesty-api` | `GUESTY_API_KEY`, `GUESTY_BASE_URL` (via APP_CONFIG_JSON) |
| `guesty-api-test` | `GUESTY_API_KEY`, `GUESTY_BASE_URL` (via APP_CONFIG_JSON) |
| `guesty-availability` | `GUESTY_CLIENT_ID`, `GUESTY_CLIENT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `guesty-calendar` | `GUESTY_API_KEY` (via APP_CONFIG_JSON) |
| `guesty-property-details` | `GUESTY_API_KEY` (via APP_CONFIG_JSON) |
| `guesty-properties` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| `guesty-webhook` | (Uses hardcoded Supabase credentials) |
| `firebase-contact-migrate` | `FIREBASE_SERVICE_ACCOUNT_JSON`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |

---

## 🚀 How to Export Secrets from Replit

### **✅ EASIEST WAY - Built-in Export Feature:**

1. Open your Replit project
2. Click the 🔒 **Secrets** icon in the left sidebar
3. Go to the **"App Secrets"** tab
4. **Look at the bottom of the panel**
5. Click **"Edit as .env"** or **"Edit as JSON"**
6. Copy ALL the contents at once
7. Paste into your `.env` file

**That's it!** This is the official Replit method. 🎉

---

### **Alternative Methods (if needed):**

#### **Method 2: Manual Copy**
1. Click the 🔒 **Secrets** tab (lock icon) in Replit
2. Click each secret's 👁️ icon to reveal value
3. Copy each secret value manually

#### **Method 3: Shell Export**
1. Open the **Shell** tab
2. Run this command to export all secrets:

```bash
# Export all environment variables to a file
env | grep -E "(GUESTY|OPENAI|SUPABASE|FIREBASE)" > secrets_export.txt
```

### **Alternative: Python script in Replit**

Create a file `export_secrets.py` in Replit:

```python
import os
import json

# List of secrets to export
secret_names = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'VITE_GUESTY_API_KEY',
    'VITE_GUESTY_BASE_URL',
    'GUESTY_CLIENT_ID',
    'GUESTY_CLIENT_SECRET',
    'GUESTY_API_KEY',
    'GUESTY_BASE_URL',
    'GUESTY_LISTING_ID',
    'OPENAI_API_KEY',
    'FIREBASE_SERVICE_ACCOUNT_JSON'
]

# Export as .env format
print("# ===== REPLIT SECRETS EXPORT =====")
print("# Copy everything below into your .env file\n")

for key in secret_names:
    value = os.getenv(key)
    if value:
        # For JSON values, keep them on one line
        if key.endswith('_JSON'):
            print(f'{key}=\'{value}\'')
        else:
            print(f'{key}={value}')
    else:
        print(f'# {key}=<not_set>')

print("\n# ===== END EXPORT =====")

# Also export as JSON for APP_CONFIG_JSON
app_config = {
    'GUESTY_API_KEY': os.getenv('GUESTY_API_KEY'),
    'GUESTY_BASE_URL': os.getenv('GUESTY_BASE_URL'),
    'GUESTY_CLIENT_ID': os.getenv('GUESTY_CLIENT_ID'),
    'GUESTY_CLIENT_SECRET': os.getenv('GUESTY_CLIENT_SECRET'),
    'GUESTY_LISTING_ID': os.getenv('GUESTY_LISTING_ID'),
    'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY')
}

# Remove None values
app_config = {k: v for k, v in app_config.items() if v is not None}

print("\n# ===== APP_CONFIG_JSON for Supabase =====")
print(json.dumps(app_config, indent=2))
```

Run it in Replit:
```bash
python export_secrets.py
```

---

## 📝 Step-by-Step Setup Instructions

### **STEP 1: Create Local `.env` File**

Once you have the secrets from Replit, create `.env` in your project root:

```bash
# Run this command (I can do this for you)
touch /Users/arajiv/CascadeProjects/ko-lake-villa-escape/.env
```

Then paste the secrets in this format:

```bash
# Frontend secrets (must start with VITE_)
VITE_SUPABASE_URL=https://zctpyveoakvbrrjmviqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_GUESTY_API_KEY=your_key_here
VITE_GUESTY_BASE_URL=https://api.guesty.com/v1

# Backend secrets (not exposed to browser)
SUPABASE_URL=https://zctpyveoakvbrrjmviqg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
GUESTY_CLIENT_ID=your_client_id
GUESTY_CLIENT_SECRET=your_client_secret
GUESTY_API_KEY=your_api_key
GUESTY_BASE_URL=https://api.guesty.com/v1
GUESTY_LISTING_ID=your_listing_id
OPENAI_API_KEY=sk-proj-xxxxx
```

### **STEP 2: Configure Supabase Edge Function Secrets**

Supabase edge functions need secrets set in **two places**:

#### **A. Individual Environment Variables**

```bash
supabase secrets set SUPABASE_URL="https://zctpyveoakvbrrjmviqg.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_key"
supabase secrets set GUESTY_CLIENT_ID="your_client_id"
supabase secrets set GUESTY_CLIENT_SECRET="your_client_secret"
```

#### **B. APP_CONFIG_JSON (Consolidated Config)**

Many functions read from `APP_CONFIG_JSON` as a single JSON object:

```bash
supabase secrets set APP_CONFIG_JSON='{
  "GUESTY_API_KEY": "your_api_key",
  "GUESTY_BASE_URL": "https://api.guesty.com/v1",
  "GUESTY_CLIENT_ID": "your_client_id",
  "GUESTY_CLIENT_SECRET": "your_client_secret",
  "GUESTY_LISTING_ID": "your_listing_id",
  "OPENAI_API_KEY": "sk-proj-xxxxx"
}'
```

**Or via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/settings/functions
2. Click **Edge Functions**
3. Click **Manage secrets**
4. Add each secret as `KEY=VALUE`

---

## ✅ Verification Checklist

After setting up secrets, verify each integration:

### **1. Test Supabase Connection**
```bash
npm run dev
# Check browser console - should NOT see "Supabase client not initialized" errors
```

### **2. Test Guesty API**
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:8080/admin`
3. Navigate to **Guesty Test** section
4. Click **Test Connection**
5. Should see: ✅ "Guesty API connected successfully"

### **3. Test OpenAI Assistant**
1. Look for AI chat widget on the site
2. Send a test message: "Hello"
3. Should get AI response about Ko Lake Villa

### **4. Test Edge Functions**
```bash
# Test Guesty availability
curl -X POST https://zctpyveoakvbrrjmviqg.supabase.co/functions/v1/guesty-availability \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"start_date":"2025-11-01","end_date":"2025-11-05"}'
```

---

## 🔒 Security Best Practices

### **✅ SAFE to commit:**
- `.env.example` (template with no real values)
- `SECRETS_TEMPLATE.md` (this file)

### **❌ NEVER commit:**
- `.env` (real secrets) - ✅ Already in `.gitignore`
- Any files containing actual API keys

### **🔐 Sensitive Keys (High Risk):**
These can modify data or incur costs:
- `SUPABASE_SERVICE_ROLE_KEY` - Full database access
- `GUESTY_API_KEY` - Can create/modify bookings
- `OPENAI_API_KEY` - Costs money per API call
- `GUESTY_CLIENT_SECRET` - OAuth credentials

### **🔓 Public Keys (Lower Risk):**
These are designed to be exposed to browsers:
- `VITE_SUPABASE_ANON_KEY` - Protected by Row Level Security (RLS)
- `VITE_SUPABASE_URL` - Public endpoint

---

## 📊 Quick Reference: Where Secrets Are Used

```
PROJECT STRUCTURE:
│
├── Frontend (Browser) ─────► .env with VITE_* variables
│                              ├── VITE_SUPABASE_URL
│                              ├── VITE_SUPABASE_ANON_KEY
│                              ├── VITE_GUESTY_API_KEY
│                              └── VITE_GUESTY_BASE_URL
│
└── Backend (Supabase) ─────► Supabase Secrets Dashboard
                               ├── Individual secrets:
                               │   ├── SUPABASE_URL
                               │   ├── SUPABASE_SERVICE_ROLE_KEY
                               │   ├── GUESTY_CLIENT_ID
                               │   └── GUESTY_CLIENT_SECRET
                               │
                               └── APP_CONFIG_JSON (consolidated):
                                   ├── GUESTY_API_KEY
                                   ├── GUESTY_BASE_URL
                                   ├── GUESTY_LISTING_ID
                                   └── OPENAI_API_KEY
```

---

## 🎯 What to Do Next

1. **Go to your Replit project** and run the export script above
2. **Copy the output** into a text file or directly here in our chat
3. **I will help you**:
   - Create the `.env` file with proper formatting
   - Generate the `APP_CONFIG_JSON` for Supabase
   - Test each integration

---

## 🆘 Troubleshooting

### **"Supabase client not initialized"**
→ Missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` in `.env`

### **"Guesty API credentials missing"**
→ Missing `VITE_GUESTY_API_KEY` in `.env`

### **"APP_CONFIG_JSON not found" (in edge functions)**
→ Need to set `APP_CONFIG_JSON` secret in Supabase dashboard

### **"OpenAI API key not configured"**
→ Missing `OPENAI_API_KEY` in `APP_CONFIG_JSON`

### **"GUESTY_CLIENT_ID not found"**
→ Need to set individual `GUESTY_CLIENT_ID` secret (not in APP_CONFIG_JSON)

---

**Ready?** Go get those secrets from Replit and paste them here! 🚀
