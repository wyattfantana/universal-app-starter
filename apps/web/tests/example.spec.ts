import { test, expect } from '@playwright/test';

test.describe('QuoteMaster App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');

    // Should redirect to dashboard or show sign in
    await expect(page).toHaveURL(/\/(dashboard|sign-in)/);
  });

  test('should navigate to clients page', async ({ page }) => {
    await page.goto('/');

    // If redirected to sign-in, skip this test
    const url = page.url();
    if (url.includes('sign-in')) {
      test.skip();
      return;
    }

    await page.click('a[href="/clients"]');
    await expect(page).toHaveURL('/clients');
    await expect(page.locator('h1')).toContainText('Clients');
  });
});
