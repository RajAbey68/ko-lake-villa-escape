/**
 * E2E Test Setup Helper
 * Run this before tests to ensure database is seeded
 */

import { chromium } from '@playwright/test';

export async function seedDatabaseViaUI() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🌱 Seeding database via admin UI...');
    
    // Navigate to admin
    await page.goto('http://localhost:8080/admin');
    
    // Click Setup tab
    await page.getByRole('tab', { name: /setup/i }).click();
    
    // Click seed button
    await page.getByRole('button', { name: /seed database/i }).click();
    
    // Wait for success
    await page.waitForSelector('text=/success/i', { timeout: 15000 });
    
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabaseViaUI()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
