import { test, expect } from '@playwright/test';

// NOTE: Auth is currently bypassed in AdminPage (BYPASS_AUTH = true)
// This test verifies the admin page loads when auth is bypassed

test.describe('AdminGuard - Access Control', () => {
  test('should allow access to admin when auth is bypassed', async ({ page }) => {
    await page.goto('/admin');

    // Should stay on /admin page (auth is bypassed)
    await expect(page).toHaveURL(/\/admin$/);

    // Should see the admin dashboard
    await expect(page.getByText(/Ko Lake Admin Dashboard/i)).toBeVisible();
    
    // Should see the testing mode banner
    await expect(page.getByText(/Testing Mode/i)).toBeVisible();
  });
});
