# 🚀 Ko Lake Villa - Final Setup Instructions

**Date:** October 19, 2025  
**Status:** Ready to configure!

---

## ✅ Step 1: Create .env File

I've created `.env.local` with all your secrets. Now copy it to `.env`:

```bash
cd /Users/arajiv/CascadeProjects/ko-lake-villa-escape
cp .env.local .env
```

**Or manually:**
1. Open `.env.local` in your editor
2. Copy all contents
3. Create a new file called `.env` 
4. Paste the contents

---

## ⚠️ Step 2: Add Missing Secrets (Optional but Recommended)

### **A. Supabase Service Role Key**

This is needed for admin operations. Get it from:

1. Go to: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/settings/api
2. Copy the **service_role** key (NOT the anon key)
3. Add to your `.env`:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_key
```

### **B. Guesty Listing ID**

This is your property's unique ID in Guesty. Get it from:

1. Log into Guesty: https://app.guesty.com
2. Go to **Listings** → Select your Ko Lake Villa property
3. Look in the URL or property details for the listing ID
4. Add to your `.env`:

```bash
GUESTY_LISTING_ID=your_property_id_here
```

---

## 🔧 Step 3: Configure Supabase Edge Function Secrets

Your edge functions need secrets set in Supabase. Run these commands:

### **Option A: Using Supabase CLI** (Recommended)

```bash
# Navigate to project
cd /Users/arajiv/CascadeProjects/ko-lake-villa-escape

# Set consolidated config (most functions use this)
supabase secrets set APP_CONFIG_JSON='{
  "GUESTY_API_KEY": "lmh5PL7T3ZJHgOGUElmMRCdebQ573jwhpgMaVUAiBGNw3hHK61i12Fln6hmKVGvR",
  "GUESTY_BASE_URL": "https://open-api.guesty.com",
  "GUESTY_LISTING_ID": "your_listing_id_here",
  "OPENAI_API_KEY": "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"
}'

# Set individual secrets (for specific functions)
supabase secrets set GUESTY_CLIENT_ID="0oaqov7x2tRSE5Ezn5d7"
supabase secrets set GUESTY_CLIENT_SECRET="h1tCPsiUOJHo4C8TE-QTol8Qwwpv9tPz9Zu2JRdxVDuEXrrAGrEVPVqK_LINlVQ8"
supabase secrets set SUPABASE_URL="https://zctpyveoakvbrrjmviqg.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### **Option B: Using Supabase Dashboard** (If CLI not available)

1. Go to: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/settings/functions
2. Click **Edge Functions** → **Manage secrets**
3. Add each secret:

```
APP_CONFIG_JSON={"GUESTY_API_KEY":"lmh5PL7T3ZJHgOGUElmMRCdebQ573jwhpgMaVUAiBGNw3hHK61i12Fln6hmKVGvR","GUESTY_BASE_URL":"https://open-api.guesty.com","OPENAI_API_KEY":"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"}

GUESTY_CLIENT_ID=0oaqov7x2tRSE5Ezn5d7
GUESTY_CLIENT_SECRET=h1tCPsiUOJHo4C8TE-QTol8Qwwpv9tPz9Zu2JRdxVDuEXrrAGrEVPVqK_LINlVQ8
SUPABASE_URL=https://zctpyveoakvbrrjmviqg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🎯 Step 4: Test Your Setup

### **Install dependencies and start dev server:**

```bash
cd /Users/arajiv/CascadeProjects/ko-lake-villa-escape
npm install
npm run dev
```

Server will start at: **http://localhost:8080**

### **Run these tests:**

#### ✅ **Test 1: Supabase Connection**
1. Open browser: http://localhost:8080
2. Open DevTools Console (F12)
3. Should NOT see: "Supabase client not initialized"
4. **Expected:** Page loads with villa content from database

#### ✅ **Test 2: Guesty Integration**
1. Go to: http://localhost:8080/admin
2. Find **Guesty Test** section
3. Click **Test Connection**
4. **Expected:** ✅ "Guesty API connected successfully"

#### ✅ **Test 3: OpenAI Assistant** (if implemented)
1. Look for chat widget on site
2. Send message: "Tell me about Ko Lake Villa"
3. **Expected:** AI responds with villa information

#### ✅ **Test 4: Booking Flow**
1. Click **Book Now** button on homepage
2. Select dates and guests
3. Submit booking request
4. **Expected:** Booking saved to database (check admin panel)

---

## 📋 Quick Reference: What We Have

| Secret | Status | Source |
|--------|--------|--------|
| VITE_SUPABASE_URL | ✅ Set | Found in code |
| VITE_SUPABASE_ANON_KEY | ✅ Set | Found in code |
| SUPABASE_SERVICE_ROLE_KEY | ⚠️ Need to add | Get from Supabase dashboard |
| VITE_GUESTY_API_KEY | ✅ Set | From Replit |
| GUESTY_CLIENT_ID | ✅ Set | From Replit |
| GUESTY_CLIENT_SECRET | ✅ Set | From Replit |
| GUESTY_ACCOUNT_ID | ✅ Set | From Replit |
| GUESTY_API_BASE | ✅ Set | From Replit |
| GUESTY_LISTING_ID | ⚠️ Need to add | Get from Guesty dashboard |
| OPENAI_API_KEY | ✅ Set | From Replit |

---

## 🐛 Troubleshooting

### **Error: "Supabase client not initialized"**
→ Check `.env` file exists and has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### **Error: "Guesty API credentials missing"**
→ Check `.env` has `VITE_GUESTY_API_KEY` and `VITE_GUESTY_BASE_URL`

### **Edge function errors in production**
→ Make sure Supabase secrets are set (see Step 3)

### **OpenAI not responding**
→ Check `APP_CONFIG_JSON` includes `OPENAI_API_KEY` in Supabase secrets

### **Changes not reflecting**
→ Restart dev server: `Ctrl+C` then `npm run dev`

---

## 🎉 You're Ready!

Once you complete Steps 1-4, your Ko Lake Villa website will be fully functional with:
- ✅ Database content from Supabase
- ✅ Guesty booking integration
- ✅ AI assistant powered by OpenAI
- ✅ Admin panel for content management

---

## 📞 Next Steps

1. **Get missing secrets** (service role key, listing ID)
2. **Test locally** with `npm run dev`
3. **Deploy to Vercel** (already configured)
4. **Add content** via admin panel at `/admin`

**Need help?** Let me know which step you're on! 🚀
