# API Keys & Secrets Audit - Ko Lake Villa Escape

**Audit Date:** October 19, 2025  
**Status:** 🔍 Reviewing available credentials and integrations

---

## 📊 Summary

| Service | Status | Location | Notes |
|---------|--------|----------|-------|
| **Supabase** | ✅ **FOUND** | Hardcoded in edge function | Public anon key available |
| **Guesty API** | ❓ **NEEDS CONFIG** | Environment variables required | Multiple endpoints configured |
| **OpenAI API** | ❓ **NEEDS CONFIG** | APP_CONFIG_JSON env var | Used for AI assistant |
| **Airbnb** | ℹ️ **NOT AN API** | Database fields only | Price comparison feature |

---

## 1️⃣ SUPABASE - ✅ Available

### **Found Credentials:**

**Supabase URL:**
```
https://zctpyveoakvbrrjmviqg.supabase.co
```

**Supabase Anon Key (Public):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDgyMTMsImV4cCI6MjA3MTcyNDIxM30.rgB4Cy_ktvQ9Dq0KmpX7IrM5vVqZW4HgtwiqulkV3Rg
```

**Project ID:** `zctpyveoakvbrrjmviqg`

### **Where it's used:**
- ✅ `/supabase/functions/booking-processor/index.ts` (line 17-18) - **HARDCODED**
- ⚠️ `/src/integrations/supabase/client.ts` - Expects env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### **Action Required:**
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=https://zctpyveoakvbrrjmviqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDgyMTMsImV4cCI6MjA3MTcyNDIxM30.rgB4Cy_ktvQ9Dq0KmpX7IrM5vVqZW4HgtwiqulkV3Rg
```

### **Database Access:**
- Dashboard: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg
- Tables: hero_content, room_types, amenities, location_info, gallery_images, bookings, contact_submissions, etc.
- 9 migrations executed successfully

---

## 2️⃣ GUESTY API - ❓ Configuration Needed

### **Required Environment Variables:**

Guesty uses multiple API keys depending on the edge function:

#### **For Frontend (`GuestyBookingWidget.tsx`):**
```env
VITE_GUESTY_API_KEY=your_guesty_api_key_here
VITE_GUESTY_BASE_URL=https://api.guesty.com/v1
```

#### **For Edge Functions:**
These need to be configured in **Supabase Edge Function Secrets** (via APP_CONFIG_JSON):

```json
{
  "GUESTY_API_KEY": "your_guesty_api_key",
  "GUESTY_BASE_URL": "https://api.guesty.com/v1",
  "GUESTY_CLIENT_ID": "your_guesty_client_id",
  "GUESTY_CLIENT_SECRET": "your_guesty_client_secret",
  "GUESTY_LISTING_ID": "your_property_listing_id"
}
```

### **Guesty Edge Functions (11 total):**

1. ✅ `guesty-api` - Generic Guesty API proxy
2. ✅ `guesty-api-test` - Test Guesty connection
3. ✅ `guesty-availability` - Check property availability
4. ✅ `guesty-calendar` - Calendar integration
5. ✅ `guesty-properties` - List properties
6. ✅ `guesty-property-details` - Get property details
7. ✅ `guesty-webhook` - Handle Guesty webhooks
8. ✅ `booking-processor` - Process bookings (sends to Guesty)

### **Where Guesty is used:**
- Booking widget for availability checking
- Creating reservations
- Calendar sync
- Property details display
- Webhook handlers for booking updates

### **How to get Guesty credentials:**
1. Log into Guesty dashboard: https://app.guesty.com
2. Navigate to Settings → API Access
3. Generate API keys and get your listing ID

---

## 3️⃣ OPENAI API - ❓ Configuration Needed

### **Required Configuration:**

OpenAI API is used for the AI Assistant feature (chat support).

**Environment Variable (in Supabase Edge Function Secrets):**
```json
{
  "OPENAI_API_KEY": "sk-proj-xxxxxxxxxxxxx"
}
```

### **Where it's used:**
- `/supabase/functions/ai-assistant/index.ts`
- Model: `gpt-4o-mini` (cost-effective)
- Use cases:
  - General resort inquiries
  - Booking assistance
  - Concierge services

### **Configuration:**
Set in Supabase dashboard under Edge Function Secrets as part of `APP_CONFIG_JSON`:

```bash
supabase secrets set APP_CONFIG_JSON='{"OPENAI_API_KEY":"sk-proj-xxx","GUESTY_API_KEY":"xxx",...}'
```

### **How to get OpenAI API key:**
1. Go to: https://platform.openai.com/api-keys
2. Create new secret key
3. Add to Supabase secrets

---

## 4️⃣ AIRBNB - ℹ️ Not an API Integration

### **What it actually is:**

Airbnb is **NOT** integrated as an API. Instead, the database has fields for:
- `airbnb_price` - Airbnb listing price (for comparison)
- `airbnb_url` - Direct link to Airbnb listing

### **Purpose:**
**Price comparison marketing** - Shows guests how much they save by booking direct:

```
Direct Price:  $150/night  ✅
Airbnb Price:  $200/night  (crossed out)
YOU SAVE:      $50/night   🎉
```

### **Where it's used:**
- `src/components/Rooms.tsx` - Room listings
- `src/components/BookingModal.tsx` - Booking modal with Airbnb redirect
- `src/components/micro/AccommodationCard.tsx` - Accommodation cards
- `src/components/admin/AdminRoomTypes.tsx` - Admin can edit Airbnb prices

### **Database Schema:**
```sql
room_types (
  airbnb_price DECIMAL,      -- Manual entry of Airbnb price
  airbnb_url VARCHAR,         -- Link to your Airbnb listing
  direct_price DECIMAL        -- Your direct booking price
)
```

### **Current Airbnb Link:**
In `BookingModal.tsx`, there's a hardcoded link:
```javascript
window.open("https://www.airbnb.com/rooms/kolakevilla", "_blank");
```

This should be updated to your actual Airbnb listing URL.

---

## 🔐 Security Notes

### ✅ **SAFE (Public Keys):**
- Supabase Anon Key - Designed to be public, has RLS (Row Level Security) protection

### ⚠️ **SENSITIVE (Keep Secret):**
- Guesty API Key - Full access to bookings, can create/modify reservations
- Guesty Client Secret - OAuth credentials
- OpenAI API Key - Incurs costs per API call
- Supabase Service Role Key (if you have it) - Full database access, bypass RLS

### 🔒 **Best Practices:**
1. ✅ Never commit `.env` files (already in `.gitignore`)
2. ✅ Use Supabase Edge Function Secrets for server-side keys
3. ✅ Frontend env vars should start with `VITE_` (exposed to browser)
4. ⚠️ Rotate API keys regularly
5. ⚠️ Set up usage alerts for OpenAI API

---

## 📋 Required Actions Checklist

### **Immediate:**
- [ ] Create `.env` file with Supabase credentials (see Section 1)
- [ ] Obtain Guesty API credentials from Guesty dashboard
- [ ] Obtain OpenAI API key from OpenAI platform
- [ ] Update Airbnb listing URL in `BookingModal.tsx`

### **Configuration:**
- [ ] Add Guesty credentials to `.env` (frontend):
  ```env
  VITE_GUESTY_API_KEY=xxx
  VITE_GUESTY_BASE_URL=https://api.guesty.com/v1
  ```

- [ ] Add secrets to Supabase Edge Functions:
  ```bash
  supabase secrets set APP_CONFIG_JSON='{
    "GUESTY_API_KEY": "your_key",
    "GUESTY_CLIENT_ID": "your_id",
    "GUESTY_CLIENT_SECRET": "your_secret",
    "GUESTY_LISTING_ID": "your_listing",
    "GUESTY_BASE_URL": "https://api.guesty.com/v1",
    "OPENAI_API_KEY": "sk-proj-xxx"
  }'
  ```

### **Testing:**
- [ ] Test Supabase connection: `npm run dev` and check console
- [ ] Test Guesty API: Visit `/admin` → Guesty Test section
- [ ] Test OpenAI: Try AI assistant chat
- [ ] Test booking flow: Complete a test booking

### **Admin Panel:**
- [ ] Populate room types with Airbnb prices in `/admin`
- [ ] Add Airbnb listing URLs for each room type
- [ ] Verify price calculations show correct savings

---

## 🚀 Quick Start Command

Create your `.env` file now:

```bash
cat > /Users/arajiv/CascadeProjects/ko-lake-villa-escape/.env << 'EOF'
# Supabase (✅ Available)
VITE_SUPABASE_URL=https://zctpyveoakvbrrjmviqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdHB5dmVvYWt2YnJyam12aXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNDgyMTMsImV4cCI6MjA3MTcyNDIxM30.rgB4Cy_ktvQ9Dq0KmpX7IrM5vVqZW4HgtwiqulkV3Rg

# Guesty API (❓ Add your credentials)
VITE_GUESTY_API_KEY=your_guesty_api_key_here
VITE_GUESTY_BASE_URL=https://api.guesty.com/v1

# Optional: OpenAI (for AI assistant)
# VITE_OPENAI_API_KEY=sk-proj-xxx
EOF
```

---

## 📞 Getting Help

### **Supabase:**
- Dashboard: https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg
- Docs: https://supabase.com/docs

### **Guesty:**
- Login: https://app.guesty.com
- API Docs: https://api.guesty.com/docs
- Support: support@guesty.com

### **OpenAI:**
- Dashboard: https://platform.openai.com
- API Keys: https://platform.openai.com/api-keys
- Docs: https://platform.openai.com/docs

---

**Status:** Ready to configure missing API keys and test integrations! 🚀
