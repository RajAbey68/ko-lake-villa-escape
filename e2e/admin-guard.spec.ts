import { test, expect } from '@playwright/test';

// Verifies AdminGuard redirects unauthenticated users to /auth
// Assumes no active Supabase session in a fresh test environment.

test.describe('AdminGuard - Access Control', () => {
  test('should redirect to /auth when not authenticated', async ({ page }) => {
    await page.goto('/admin');

    // Expect redirect to /auth (allow some time for guard effect)
    await expect.poll(async () => page.url(), { timeout: 5000 }).toMatch(/\/auth(\?.*)?$/);

    // Page should show some auth-related UI text
    // We don't assert specific copy; just ensure we're not on admin
    expect(page.url()).toContain('/auth');
  });
});
