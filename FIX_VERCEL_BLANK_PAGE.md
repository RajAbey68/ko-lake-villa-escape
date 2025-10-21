# 🚨 FIX: Vercel Blank Page Issue

## **Problem:**
- ✅ **Local (localhost:8080):** Works perfectly
- ❌ **Vercel (production):** Blank white page

## **Root Cause:**
Missing environment variables on Vercel. The app needs Supabase credentials to function.

---

## **SOLUTION (5 minutes):**

### **Step 1: Open Vercel Dashboard**
Click this link: https://vercel.com/rajabey68s-projects/ko-lake-villa-escape/settings/environment-variables

### **Step 2: Add These 2 Required Variables**

Click **"Add New"** for each:

#### **Variable 1:**
```
Name: VITE_SUPABASE_URL
Value: https://zctpyveoakvbrrjmviqg.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

#### **Variable 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: [Copy from your .env.local file]
Environment: ✅ Production ✅ Preview ✅ Development
```

### **Step 3: Get Your Supabase Anon Key**

Run this command in your terminal:
```bash
cd /Users/arajiv/CascadeProjects/ko-lake-villa-escape
grep "^VITE_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2
```

Copy the output and paste it as the value for `VITE_SUPABASE_ANON_KEY` in Vercel.

### **Step 4: Save & Redeploy**

1. Click **"Save"** on each variable
2. Vercel will automatically trigger a new deployment
3. Wait 2-3 minutes for build to complete
4. Visit: https://ko-lake-villa-escape.vercel.app
5. **Should now see your website!** 🎉

---

## **Optional: Add Guesty Variables (for booking widget)**

If you want the booking widget to work:

#### **Variable 3:**
```
Name: VITE_GUESTY_API_KEY
Value: [Copy from your .env.local file]
Environment: ✅ Production ✅ Preview ✅ Development
```

#### **Variable 4:**
```
Name: VITE_GUESTY_BASE_URL
Value: https://open-api.guesty.com
Environment: ✅ Production ✅ Preview ✅ Development
```

---

## **Why This Happened:**

- Local development uses `.env.local` file (gitignored, not pushed to GitHub)
- Vercel builds from GitHub code (no .env.local file)
- Without environment variables, Supabase client fails → blank page
- Solution: Add environment variables directly in Vercel dashboard

---

## **Verification:**

After redeployment, you should see:
- ✅ Hero section with pool sunset image
- ✅ "Ko Lake • Ahangama" header
- ✅ Navigation menu
- ✅ All pages load correctly
- ✅ No blank page!

---

**Next Action:** Add the 2 required environment variables to Vercel now! 👆

**Direct Link:** https://vercel.com/rajabey68s-projects/ko-lake-villa-escape/settings/environment-variables
