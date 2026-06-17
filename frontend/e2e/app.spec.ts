import { test, expect } from '@playwright/test';

test('app loads main view with family tree dropdown', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Family Tree', { exact: true })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Family tree' })).toBeVisible();
  await expect(page.getByText('Tree visualization will appear here.')).toBeVisible();
});

test('dropdown lists bundled family trees', async ({ page }) => {
  await page.goto('/');

  const combobox = page.getByRole('combobox', { name: 'Family tree' });
  await expect(combobox).toBeEnabled();
  await combobox.click();

  await expect(page.getByRole('option', { name: 'Family One' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Patel Family' })).toBeVisible();
});

test('selecting a tree updates the visible selection state', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox', { name: 'Family tree' }).click();
  await page.getByRole('option', { name: 'Patel Family' }).click();

  await expect(page.getByRole('combobox', { name: 'Family tree' })).toContainText('Patel Family');
  await expect(page.getByText(/Selected: Patel Family/)).toBeVisible();
});
