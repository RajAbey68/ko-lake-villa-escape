const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080');
  await page.waitForTimeout(2000);
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'homepage-actual.png', 
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved: homepage-actual.png');
  
  // Log what sections are visible
  const sections = await page.$$eval('[id]', els => 
    els.map(el => ({ id: el.id, visible: el.offsetHeight > 0 }))
  );
  console.log('\nVisible sections:', sections.filter(s => s.visible));
  
  await browser.close();
})();
