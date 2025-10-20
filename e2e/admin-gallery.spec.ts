import { test, expect } from '@playwright/test';

// Covers Admin Gallery UI basics and client-side validation without touching DB

test.describe('Admin Gallery - Create Flow Validation', () => {
  test('should open Add Gallery Item and validate missing media source', async ({ page }) => {
    await page.goto('/admin');

    // Navigate to Gallery tab
    await page.getByRole('tab', { name: /gallery/i }).click();

    // Open Add Gallery Item dialog
    await page.getByRole('button', { name: /add gallery item/i }).click();
    await expect(page.getByText(/add new gallery item/i)).toBeVisible();

    // Switch to URL entry
    await page.getByTestId('tab-url').click();

    // Ensure URL input is visible
    await expect(page.getByTestId('input-url')).toBeVisible();

    // Attempt submit with empty URL
    await page.getByTestId('button-submit').click();

    // Expect validation toast/message
    await expect(page.getByText(/please upload a file or enter a url/i)).toBeVisible();

    // Cancel closes dialog
    await page.getByTestId('button-cancel').click();
    await expect(page.getByText(/add new gallery item/i)).not.toBeVisible();
  });
});
