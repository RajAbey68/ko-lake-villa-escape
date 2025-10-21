# AI Assistant Setup Guide

## Current Status
⚠️ **TEMPORARILY DISABLED** - The AI Assistant tab has been disabled in the admin panel to prevent hanging issues.

## Why Was It Disabled?
The AI Assistant feature requires the `APP_CONFIG_JSON` secret to be configured in Supabase Edge Functions. Without this secret, the AI assistant will hang when trying to make API calls.

## How to Enable the AI Assistant

### Step 1: Configure Supabase Secret

You need to add the `APP_CONFIG_JSON` secret to your Supabase project:

#### Option A: Using Supabase Dashboard (Easiest)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/zctpyveoakvbrrjmviqg)
2. Navigate to **Edge Functions** → **Secrets**
3. Click **Add Secret**
4. Set the secret:
   - **Name:** `APP_CONFIG_JSON`
   - **Value:** 
   ```json
   {"OPENAI_API_KEY":"sk-proj-YOUR_OPENAI_KEY_HERE","GUESTY_API_KEY":"YOUR_GUESTY_KEY_HERE"}
   ```
5. Click **Save**

#### Option B: Using Supabase CLI
```bash
# Make sure you're logged in to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref zctpyveoakvbrrjmviqg

# Set the secret
supabase secrets set APP_CONFIG_JSON='{"OPENAI_API_KEY":"sk-proj-YOUR_KEY","GUESTY_API_KEY":"YOUR_KEY"}'

# Verify it was set
supabase secrets list
```

### Step 2: Re-enable the AI Tab

Once the secret is configured, uncomment the AI Assistant code in `/src/pages/AdminPage.tsx`:

1. **Uncomment the import** (line 19-20):
```typescript
// Change this:
// TEMPORARILY DISABLED: AI Assistant requires APP_CONFIG_JSON secret in Supabase
// import { AdminAIAssistant } from '@/components/admin/AdminAIAssistant';

// To this:
import { AdminAIAssistant } from '@/components/admin/AdminAIAssistant';
```

2. **Update the grid columns** (line 79):
```typescript
// Change this:
<TabsList className="grid grid-cols-4 lg:grid-cols-10 w-full">

// To this:
<TabsList className="grid grid-cols-4 lg:grid-cols-11 w-full">
```

3. **Uncomment the AI tab trigger** (lines 120-124):
```typescript
// Change this:
{/* TEMPORARILY DISABLED: AI Assistant requires APP_CONFIG_JSON secret in Supabase */}
{/* <TabsTrigger value="ai" className="flex items-center gap-2">
  <Sparkles className="h-4 w-4" />
  <span className="hidden sm:inline">AI Test</span>
</TabsTrigger> */}

// To this:
<TabsTrigger value="ai" className="flex items-center gap-2">
  <Sparkles className="h-4 w-4" />
  <span className="hidden sm:inline">AI Test</span>
</TabsTrigger>
```

4. **Uncomment the AI tab content** (lines 183-186):
```typescript
// Change this:
{/* TEMPORARILY DISABLED: AI Assistant requires APP_CONFIG_JSON secret in Supabase */}
{/* <TabsContent value="ai">
  <AdminAIAssistant />
</TabsContent> */}

// To this:
<TabsContent value="ai">
  <AdminAIAssistant />
</TabsContent>
```

### Step 3: Test the AI Assistant

1. Restart your dev server (if running)
2. Go to `/admin`
3. Click on the **AI Test** tab
4. Try the "Test AI Assistant" button
5. You should see a response from GPT-4o-mini

## What the AI Assistant Does

Once enabled, the AI Assistant provides:
- **General Q&A** about Ko Lake Villa
- **SEO Content Generation** for meta titles, descriptions, and selling points
- **Future Features** (planned):
  - Gallery image SEO optimization
  - Room description generation
  - Blog post creation
  - Multilingual translation
  - Guest review responses

## Cost Considerations

- **Model:** GPT-4o-mini
- **Cost:** ~$0.01 per 1,000 tokens
- **Estimated:** $1-20/month depending on usage

## Troubleshooting

### "OpenAI API key not configured" Error
- The `APP_CONFIG_JSON` secret is missing or malformed
- Verify the secret is set in Supabase Edge Functions
- Make sure the JSON is valid (use a JSON validator)

### "Failed to connect to AI assistant" Error
- Check Supabase Edge Function logs
- Verify the OpenAI API key is valid
- Check if you have OpenAI API credits

### AI Still Hangs
- Clear browser cache
- Check browser console for errors
- Verify the Edge Function is deployed: `supabase functions list`

## Security Notes

⚠️ **Important:**
- The OpenAI API key should **ONLY** be stored in Supabase Edge Function secrets
- **NEVER** put the OpenAI key in `.env.local` or commit it to git
- The key is accessed server-side only (in the Edge Function)
- Client-side code never sees the actual API key

## Need Help?

If you encounter issues:
1. Check Supabase Edge Function logs
2. Verify the secret format is correct JSON
3. Test the OpenAI API key directly at https://platform.openai.com/playground
4. Check the Edge Function code at `/supabase/functions/ai-assistant/index.ts`
