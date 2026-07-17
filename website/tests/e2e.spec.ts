import { test, expect } from '@playwright/test';

test.describe('Documentation Site Interactive E2E', () => {
  const setupErrorTracking = (page) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        const url = msg.location().url || '';
        if (text.includes('404') && (url === 'http://localhost:4173/' || url.includes('favicon.ico'))) return;
        if (text.includes('ERR_CONNECTION_RESET') || text.includes('ERR_CONNECTION_REFUSED')) return;
        consoleErrors.push(`${text} at ${url}`);
      }
    });
    return consoleErrors;
  };

  test('Desktop interactions and link clickability', async ({ page }, testInfo) => {
    const consoleErrors = setupErrorTracking(page);

    await page.goto('/');
    await expect(page).toHaveTitle(/Rabto/);
    
    // Capture Home
    await page.screenshot({ path: `test-results/${testInfo.project.name}-home.png` });

    // Click Logo
    await page.locator('.VPNavBarTitle').click();
    await expect(page).toHaveURL(/.*\/rabto-ai-skills\//);

    // Theme Toggle
    const themeToggle = page.locator('.VPSwitchAppearance').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }

    // External links: GitHub social icon
    const githubLink = page.locator('.social-links a[aria-label="github"]').first();
    if (await githubLink.isVisible()) {
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        githubLink.click()
      ]);
      await newPage.waitForLoadState();
      expect(newPage.url()).toContain('github.com');
      await newPage.close();
    }

    // View on GitHub (if it exists on home page)
    const viewOnGithub = page.getByRole('link', { name: /View on GitHub/i }).first();
    if (await viewOnGithub.isVisible()) {
       const [newPage] = await Promise.all([
         page.context().waitForEvent('page'),
         viewOnGithub.click()
       ]);
       await newPage.waitForLoadState();
       expect(newPage.url()).toContain('github.com');
       await newPage.close();
    }

    // Get Started
    await page.getByRole('link', { name: 'Get Started' }).first().click();
    await expect(page).toHaveURL(/.*\/guide\//);
    await page.screenshot({ path: `test-results/${testInfo.project.name}-guide.png` });

    // Sidebar Items
    if (!testInfo.project.name.toLowerCase().includes('mobile')) {
      const sidebarLinks = page.locator('.VPSidebar a');
      const count = await sidebarLinks.count();
      
      for (let i = 0; i < count; i++) {
         const link = sidebarLinks.nth(i);
         await link.scrollIntoViewIfNeeded();
         await link.click();
         await page.waitForLoadState('networkidle');
         
         const bodyText = await page.locator('body').innerText();
         expect(bodyText).not.toContain('404 | Not Found');
         expect(bodyText).not.toContain('PAGE NOT FOUND');
         expect(page.url()).toContain('/rabto-ai-skills/');
      }
    }

    // Previous / Next pages
    if (await page.locator('.VPDocFooter .prev-link').isVisible()) {
       await page.locator('.VPDocFooter .prev-link').click();
    }
    if (await page.locator('.VPDocFooter .next-link').isVisible()) {
       await page.locator('.VPDocFooter .next-link').click();
    }

    expect(consoleErrors).toHaveLength(0);
  });

  test('Mobile interactions', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 375, height: 812 }); // Mobile
    const consoleErrors = setupErrorTracking(page);

    await page.goto('/');
    
    // Capture Mobile Home
    await page.screenshot({ path: `test-results/${testInfo.project.name}-home.png` });

    // Open mobile hamburger menu
    const menuButton = page.locator('.VPNavBarHamburger');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.locator('.VPNavScreen')).toBeVisible();
      
      // Click a nav link inside
      await page.locator('.VPNavScreen a[href*="/guide/"]').first().click();
      await expect(page).toHaveURL(/.*\/guide\//);
      await page.screenshot({ path: `test-results/${testInfo.project.name}-guide.png` });
    }

    expect(consoleErrors).toHaveLength(0);
  });
});
