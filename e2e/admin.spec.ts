import { test, expect } from '@playwright/test';

test.describe('Admin Panel - User Experience', () => {
  
  test('admin panel should load', async ({ page }) => {
    await page.goto('/admin');
    
    // Should see admin dashboard
    await expect(page.getByText(/admin dashboard/i)).toBeVisible();
  });

  test('setup tab should be visible and functional', async ({ page }) => {
    await page.goto('/admin');
    
    // Should see Setup tab
    await expect(page.getByRole('tab', { name: /setup/i })).toBeVisible();
    
    // Click on Setup tab
    await page.getByRole('tab', { name: /setup/i }).click();
    
    // Should see seed database button
    await expect(page.getByRole('button', { name: /seed database/i })).toBeVisible();
  });

  test('seed database button should work', async ({ page }) => {
    await page.goto('/admin');
    
    // Click Setup tab
    await page.getByRole('tab', { name: /setup/i }).click();
    
    // Click seed button (stable test id)
    await page.getByTestId('seed-db-button').click();
    
    // Should see success message (wait up to 10 seconds)
    await expect(page.getByText(/success/i)).toBeVisible({ timeout: 10000 });
  });

  test('gallery tab should be accessible', async ({ page }) => {
    await page.goto('/admin');
    
    // Should see Gallery tab
    await expect(page.getByRole('tab', { name: /gallery/i })).toBeVisible();
    
    // Click Gallery tab
    await page.getByRole('tab', { name: /gallery/i }).click();
    
    // Should show gallery management interface
    await expect(page.getByText(/gallery/i)).toBeVisible();
  });

  test('room types tab should be accessible', async ({ page }) => {
    await page.goto('/admin');
    
    // Should see Rooms tab
    await expect(page.getByRole('tab', { name: /rooms/i })).toBeVisible();
  });
});
