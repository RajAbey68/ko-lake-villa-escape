import { test, expect } from '@playwright/test';

test.describe('Deals Page - Booking Modal', () => {
  test.skip('should open booking modal from hero CTA', async ({ page }) => {
    // SKIPPED: DealsPageSimple doesn't have booking modal - uses direct links instead
    await page.goto('/deals');
    await page.getByRole('button', { name: /book now & save/i }).click();
    await expect(page.getByText(/book ko lake villa/i)).toBeVisible();
  });

  test.skip('should open booking modal from a deal card', async ({ page }) => {
    // SKIPPED: DealsPageSimple doesn't have booking modal - uses direct links instead
    await page.goto('/deals');
    await page.getByRole('button', { name: /book this package/i }).first().click();
    await expect(page.getByText(/book ko lake villa/i)).toBeVisible();
  });

  test.skip('should show Guesty instant booking widget when clicked', async ({ page }) => {
    // SKIPPED: DealsPageSimple doesn't have Guesty widget - uses WhatsApp link instead
    await page.goto('/deals');
    await page.getByRole('button', { name: /book now & save/i }).click();
    await page.getByRole('button', { name: /instant booking via guesty/i }).click();
    await expect(page.getByTitle(/ko lake villa booking/i)).toBeVisible();
  });
});
