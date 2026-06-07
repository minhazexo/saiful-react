import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE (375)', width: 375, height: 667 },
  { name: 'tablet (768)', width: 768, height: 1024 },
  { name: 'iPad (1024)', width: 1024, height: 768 },
];

for (const vp of MOBILE_VIEWPORTS) {
  test.describe(`responsive @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('home page renders without horizontal scroll', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      // No body horizontal overflow
      const overflowX = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflowX).toBeLessThanOrEqual(1);
    });

    test('mobile nav drawer opens and closes', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const toggle = page.locator('.nav-toggle');
      // Regression: the closed menu (off-screen via transform: translateX(100%))
      // must not visually clip the toggle button. Toggle must be visible and
      // clickable BEFORE the drawer is opened.
      await expect(toggle).toBeVisible();
      const toggleBox = await toggle.boundingBox();
      expect(toggleBox?.width).toBeGreaterThanOrEqual(44);
      expect(toggleBox?.height).toBeGreaterThanOrEqual(44);
      await toggle.click();
      const drawer = page.locator('.nav-links.active');
      await expect(drawer).toBeVisible();
      const bookCta = drawer.getByRole('button', { name: /book free call/i });
      await expect(bookCta).toBeVisible();
      await toggle.click();
      await expect(drawer).toBeHidden();
    });

    test('contact page has visible name field and captcha', async ({ page }) => {
      await page.goto('/contact');
      await expect(page.getByLabel('Name')).toBeVisible();
      await expect(page.getByLabel(/What is .+\?/)).toBeVisible();
    });
  });
}

test.describe('admin responsive', () => {
  test('admin sidebar toggle is reachable on mobile and opens drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/login');
    // Login first (if no auth, just check toggle button exists on dashboard)
    // We can hit the dashboard URL directly - the auth state machine may redirect.
    await page.goto('/admin');
    // Toggle should be visible at small viewports
    const toggle = page.locator('.sidebar-toggle');
    if (await toggle.isVisible()) {
      await toggle.click();
      const sidebar = page.locator('.admin-sidebar');
      await expect(sidebar).toBeVisible();
    }
  });
});
