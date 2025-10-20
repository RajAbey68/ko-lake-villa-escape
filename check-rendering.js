const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    console.log(`BROWSER ${msg.type()}: ${msg.text()}`);
  });
  
  // Capture errors
  page.on('pageerror', error => {
    console.error(`PAGE ERROR: ${error.message}`);
  });
  
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
  
  // Check what's actually visible
  const content = await page.evaluate(() => {
    return {
      title: document.title,
      hasHero: !!document.querySelector('[class*="hero"]') || !!document.querySelector('h1'),
      hasImages: document.querySelectorAll('img').length,
      hasStyles: !!document.querySelector('style') || !!document.querySelector('link[rel="stylesheet"]'),
      bodyClasses: document.body.className,
      errors: window.console ? 'Console available' : 'No console'
    };
  });
  
  console.log('\n📊 Page Analysis:');
  console.log(JSON.stringify(content, null, 2));
  
  // Wait a bit for user to see
  console.log('\n👀 Browser window opened - check it visually');
  console.log('Press Ctrl+C to close');
  
  await page.waitForTimeout(60000);
  await browser.close();
})();
