import { test, expect } from '@playwright/test';

test('Documentation site links and clickability', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const url = msg.location().url || '';
      if (text.includes('404') && (url === 'http://localhost:4173/' || url.includes('favicon.ico'))) {
        return;
      }
      errors.push(text + ' at ' + url);
    }
  });

  await page.goto('/');
  await expect(page).toHaveTitle(/CineForge/);

  // Capture Home
  await page.screenshot({ path: 'test-results/home.png' });

  // Get all links
  const links = await page.locator('a').all();
  const hrefs = new Set<string>();
  
  for (const link of links) {
    const href = await link.getAttribute('href');
    if (href && !href.startsWith('http')) {
      hrefs.add(href);
    }
  }

  console.log(`Found ${hrefs.size} internal links to test.`);

  for (const href of hrefs) {
    // Click through each link
    await page.goto(href);
    
    // Verify no 404
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('404 | Not Found');
    expect(bodyText).not.toContain('PAGE NOT FOUND');
    
    // Take a screenshot of each valid page (first time we visit)
    const slug = href.replace(/[^a-zA-Z0-9]/g, '_');
    await page.screenshot({ path: `test-results/page-${slug}.png` });
  }

  expect(errors).toHaveLength(0);
});
