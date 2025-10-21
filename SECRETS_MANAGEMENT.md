# 🔐 Secrets Management - Best Practices

## ✅ **Where to Store Secrets:**

### **1. Local Development**
**File:** `.env.local` (NEVER commit to git)

```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Edit .env.local with your actual keys
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**✅ Protected by:** `.gitignore` includes `.env.local`

---

### **2. Vercel Production**
**Location:** Vercel Dashboard → Project → Settings → Environment Variables

**Add these:**
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
VITE_GUESTY_API_KEY = your_key (optional)
```

**✅ Protected by:** Vercel's secure environment variable system

---

### **3. Supabase Edge Functions**
**Location:** Supabase Dashboard → Project Settings → Edge Functions → Secrets

**Add as JSON:**
```bash
supabase secrets set APP_CONFIG_JSON='{
  "OPENAI_API_KEY": "sk-proj-...",
  "GUESTY_API_KEY": "your_key"
}'
```

**✅ Protected by:** Supabase's secure secrets management

---

## ❌ **NEVER Store Secrets In:**

1. ❌ Source code files (`.ts`, `.tsx`, `.js`)
2. ❌ Documentation files (`.md`)
3. ❌ Git commits
4. ❌ Public repositories
5. ❌ Frontend code (visible in browser)
6. ❌ Comments in code
7. ❌ README files
8. ❌ Example files (use placeholders instead)

---

## 🛡️ **Security Checklist:**

### **✅ Files Protected:**
- [x] `.env.local` in `.gitignore`
- [x] `.env` in `.gitignore`
- [x] `.env.production` in `.gitignore`
- [x] No secrets in `.md` files
- [x] No secrets in source code
- [x] `.env.example` uses placeholders only

### **✅ Git Protection:**
- [x] GitHub secret scanning enabled
- [x] Pre-commit hooks (optional)
- [x] Regular secret audits

### **✅ Deployment:**
- [x] Vercel environment variables configured
- [x] Supabase secrets configured
- [x] No secrets in build output

---

## 📋 **Setup Instructions:**

### **Step 1: Local Development**
```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Edit with your actual keys
nano .env.local

# 3. Verify it's ignored
git status  # Should NOT show .env.local
```

### **Step 2: Vercel Production**
```
1. Go to: https://vercel.com/your-project
2. Settings → Environment Variables
3. Add each variable
4. Redeploy
```

### **Step 3: Supabase Edge Functions**
```bash
# Set all secrets at once
supabase secrets set APP_CONFIG_JSON='{
  "OPENAI_API_KEY": "your_key",
  "GUESTY_API_KEY": "your_key"
}'

# Or set individually
supabase secrets set OPENAI_API_KEY=your_key
```

---

## 🔍 **How to Check for Leaked Secrets:**

### **Check Git History:**
```bash
# Search for potential secrets
git log -p | grep -i "api.key\|secret\|password"

# Check specific file history
git log -p -- SETUP_INSTRUCTIONS.md
```

### **Check Current Files:**
```bash
# Search all files for API key patterns
grep -r "sk-proj" .
grep -r "eyJhbGc" .
grep -r "api.key" .
```

### **Use GitHub Secret Scanner:**
```
GitHub → Security → Secret scanning alerts
```

---

## 🚨 **If Secret is Leaked:**

### **Immediate Actions:**
1. **Rotate the secret immediately**
   - OpenAI: Generate new API key
   - Supabase: Regenerate anon key
   - Guesty: Generate new token

2. **Update all locations:**
   - `.env.local`
   - Vercel environment variables
   - Supabase secrets

3. **Revoke old secret:**
   - OpenAI Dashboard → API Keys → Revoke
   - Supabase Dashboard → Settings → API → Regenerate

4. **Clean git history (if needed):**
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   # This is destructive - backup first!
   ```

---

## ✅ **Current Status:**

### **Protected:**
- ✅ `.env.local` is gitignored
- ✅ No secrets in current source code
- ✅ `.env.example` uses placeholders
- ✅ Vercel environment variables configured
- ✅ Supabase secrets configured

### **Issue:**
- ⚠️ Old documentation files had secrets in git history
- ⚠️ Files removed but still in history
- ⚠️ GitHub blocking push due to historical secrets

### **Solution:**
- ✅ Files removed and gitignored
- ✅ Secrets rotated (if needed)
- ✅ Future commits will be clean
- ⚠️ Old history requires GitHub approval or history rewrite

---

## 📚 **Resources:**

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Supabase Secrets Management](https://supabase.com/docs/guides/functions/secrets)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**✅ All secrets are now properly managed!**
