import { test, expect } from '@playwright/test';

// Smoke test for homepage using SimpleHome

test.describe('Homepage (Mock Data)', () => {
  test('should render hero, rooms, gallery, and contact sections', async ({ page }) => {
    await page.goto('/');

    // Hero
    await expect(page.getByRole('heading', { name: /lakeside holiday rental/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /check availability/i })).toBeVisible();

    // Rooms section
    await page.locator('#rooms').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /rooms & suites/i })).toBeVisible();
    await expect(page.getByText(/family suite/i).first()).toBeVisible();
    await expect(page.getByText(/group room/i).first()).toBeVisible();

    // Gallery section
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /gallery/i })).toBeVisible();

    // Contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /ready to book/i })).toBeVisible();
  });
});
