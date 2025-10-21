# 🔧 Vercel Environment Variables Setup

## ❌ Problem: Blank Page on Vercel Deployment

**Cause:** Missing environment variables on Vercel (Supabase credentials)

**Local works:** ✅ Has `.env.local` with all credentials  
**Vercel fails:** ❌ No environment variables configured

---

## ✅ Solution: Add Environment Variables to Vercel

### **Step 1: Go to Vercel Dashboard**
1. Visit: https://vercel.com/dashboard
2. Click on your project: **ko-lake-villa-escape**
3. Go to: **Settings** → **Environment Variables**

### **Step 2: Add Required Variables**

Add these **3 REQUIRED** variables:

#### **1. VITE_SUPABASE_URL**
```
Value: https://zctpyveoakvbrrjmviqg.supabase.co
Environment: Production, Preview, Development (select all)
```

#### **2. VITE_SUPABASE_ANON_KEY**
```
Value: [Your Supabase anon key from .env.local]
Environment: Production, Preview, Development (select all)
```

#### **3. VITE_GUESTY_API_KEY** (Optional - for booking)
```
Value: [Your Guesty API key from .env.local]
Environment: Production, Preview, Development (select all)
```

#### **4. VITE_GUESTY_BASE_URL** (Optional - for booking)
```
Value: https://open-api.guesty.com
Environment: Production, Preview, Development (select all)
```

---

## 📋 How to Get Your Values

### **From Your Local .env.local:**

Run this command in your project directory:
```bash
cat .env.local
```

Copy the values (everything after the `=` sign) for each variable.

---

## 🚀 After Adding Variables

1. **Redeploy:** Vercel will automatically redeploy after you save the environment variables
2. **Wait 2-3 minutes** for the build to complete
3. **Visit:** https://ko-lake-villa-escape.vercel.app
4. **Should see:** Your beautiful Ko Lake website! 🎉

---

## 🔍 Verify It Worked

After redeployment, you should see:
- ✅ Hero section with pool image
- ✅ Navigation bar
- ✅ "Ko Lake • Ahangama" branding
- ✅ All pages load correctly

If still blank:
- Check browser console (F12) for errors
- Verify environment variables are saved correctly
- Try a manual redeploy: Deployments → ... → Redeploy

---

## 📝 Quick Reference

**Vercel Project:** https://vercel.com/rajabey68s-projects/ko-lake-villa-escape  
**Production URL:** https://ko-lake-villa-escape.vercel.app  
**Supabase Dashboard:** https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg

---

**Next Step:** Add these environment variables to Vercel now! 👆
