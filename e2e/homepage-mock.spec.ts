import { test, expect } from '@playwright/test';

// Smoke test for homepage using mock values in SimpleIndex

test.describe('Homepage (Mock Data)', () => {
  test('should render hero, rooms, gallery, and contact sections', async ({ page }) => {
    await page.goto('/');

    // Hero
    await expect(page.getByRole('heading', { name: /ko lake villa escape/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /book your stay/i })).toBeVisible();

    // Rooms section
    await page.locator('#rooms').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /our accommodations/i })).toBeVisible();
    await expect(page.getByText(/lakeside master suite/i)).toBeVisible();
    await expect(page.getByText(/garden villa/i)).toBeVisible();
    await expect(page.getByText(/entire villa/i)).toBeVisible();

    // Gallery section
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /gallery/i })).toBeVisible();

    // Contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /open contact page/i })).toBeVisible();
  });
});
