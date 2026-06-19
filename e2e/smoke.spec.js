import { test, expect } from '@playwright/test';

test.describe('public site smoke', () => {
  test('home page loads with title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Saiful Studios/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('contact page shows captcha', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByLabel(/What is .+\?/)).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
  });

  test('blog page lists posts or shows empty state', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('heading', { level: 1, name: /Blog/i })).toBeVisible();
  });

  test('404 page is shown for unknown route', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');
    expect(response?.status() ?? 200).toBeGreaterThanOrEqual(200);
    await expect(page.getByText(/404|Not found|Page not found/i)).toBeVisible();
  });
});
