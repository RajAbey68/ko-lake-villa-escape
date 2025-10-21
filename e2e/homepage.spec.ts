import { test, expect } from '@playwright/test';

test.describe('Homepage - User Experience', () => {
  
  test('homepage should load without errors', async ({ page }) => {
    await page.goto('/');
    
    // Should NOT show "Failed to load" errors
    const failedMessages = await page.getByText(/failed to load/i).count();
    expect(failedMessages).toBe(0);
  });

  test('hero section should display', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero')).toBeVisible();
  });

  test('rooms section should display', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('rooms-section')).toBeVisible();
  });

  test('gallery should display section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('gallery-section')).toBeVisible();
  });

  test('stats strip should display', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('stats')).toBeVisible();
  });

  test('location info should be visible in hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hero')).toContainText(/koggala lake/i);
  });

  test('navigation menu should work', async ({ page }) => {
    await page.goto('/');
    
    // Should see navigation
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Should have menu items - use exact match to avoid duplicates
    await expect(page.getByRole('link', { name: 'Rooms', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Gallery', exact: true })).toBeVisible();
  });

  test('contact section should be accessible', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('contact-section')).toBeVisible();
  });
});
