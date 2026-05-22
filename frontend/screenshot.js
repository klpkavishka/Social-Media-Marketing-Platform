const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/dashboard/content/calendar', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'calendar-screenshot.png' });
  await browser.close();
})();
