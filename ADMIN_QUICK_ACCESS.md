# 🚀 Quick Admin Access - Ko Lake Villa

**Get into admin panel in 2 minutes!**

---

## ⚡ Option 1: Temporary Bypass (FASTEST - For Testing Only)

This removes the auth check temporarily so you can access admin immediately:

### **Edit: `src/pages/AdminPage.tsx`**

**Find lines 24-28:**
```typescript
useEffect(() => {
  if (!loading && (!user || !isAdmin)) {
    navigate('/auth');
  }
}, [user, loading, isAdmin, navigate]);
```

**Comment them out:**
```typescript
useEffect(() => {
  // TEMPORARY: Bypass auth for testing
  // if (!loading && (!user || !isAdmin)) {
  //   navigate('/auth');
  // }
}, [user, loading, isAdmin, navigate]);
```

**Find lines 38-40:**
```typescript
if (!user || !isAdmin) {
  return null;
}
```

**Comment them out:**
```typescript
// TEMPORARY: Bypass auth for testing
// if (!user || !isAdmin) {
//   return null;
// }
```

**Save the file** and the dev server will auto-reload!

Now visit: **http://localhost:8080/admin** 🎉

---

## ✅ Option 2: Create Admin User (Proper Way)

### **Step 1: Sign Up**
1. Go to: http://localhost:8080/auth
2. Sign up with any email (can be fake for testing)
3. Example: `admin@kolakevilla.com` / `password123`

### **Step 2: Make User Admin**

Run this in **Supabase SQL Editor:**

```sql
-- Make your user an admin
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object('role', 'admin')
WHERE email = 'admin@kolakevilla.com';  -- Change to your email

-- Verify it worked
SELECT email, raw_user_meta_data 
FROM auth.users;
```

### **Step 3: Log In**
1. Go to: http://localhost:8080/auth
2. Log in with your credentials
3. Go to: http://localhost:8080/admin

---

## 📊 Now Seed Your Database!

Run this in **Supabase SQL Editor:**
https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg/editor

Copy and paste contents from: `seed-database.sql`

This will populate:
- ✅ 2 Hero slides
- ✅ 3 Room types
- ✅ 10 Amenities
- ✅ 1 Location info
- ✅ 6 Gallery images

---

## 🎯 Quick Test

After seeding:

1. Visit http://localhost:8080 - Content should load!
2. Visit http://localhost:8080/admin - Admin panel!
3. Click **Gallery** tab
4. See your placeholder images
5. Click **Add New Image** to upload your own!

---

**Recommendation:** Use Option 1 for now (temp bypass), seed the database, test everything, then set up proper auth later!
