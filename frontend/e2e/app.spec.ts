import { test, expect } from '@playwright/test';

test('app loads main view with family tree dropdown', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Family Tree', { exact: true })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Family tree' })).toBeVisible();
  await expect(page.getByText('Tree visualization will appear here.')).toBeVisible();
});
