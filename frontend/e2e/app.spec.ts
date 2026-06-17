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
  await expect(page.getByRole('option', { name: 'Vora Family' })).toBeVisible();
});

test('selecting a tree updates the visible selection state', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox', { name: 'Family tree' }).click();
  await page.getByRole('option', { name: 'Patel Family' }).click();

  await expect(page.getByRole('combobox', { name: 'Family tree' })).toContainText('Patel Family');
  await expect(page.getByRole('region', { name: 'Generation 1' })).toContainText('Ramesh Patel');
  await expect(page.getByRole('region', { name: 'Generation 3' })).toContainText('Anika Patel');
  await expect(page.getByLabel('Family tree branches')).toContainText('Ramesh Patel');
});

test('tree visualization supports expand and collapse', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox', { name: 'Family tree' }).click();
  await page.getByRole('option', { name: 'Patel Family' }).click();

  const collapseButton = page.getByRole('button', { name: 'Collapse branch for Ramesh Patel' });
  await expect(collapseButton).toBeVisible();

  await collapseButton.click();
  await expect(page.getByRole('button', { name: 'Expand branch for Ramesh Patel' })).toBeVisible();
});

test('Vora family tree renders all five generations', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('combobox', { name: 'Family tree' }).click();
  await page.getByRole('option', { name: 'Vora Family' }).click();

  await expect(page.getByRole('combobox', { name: 'Family tree' })).toContainText('Vora Family');
  await expect(page.getByRole('region', { name: 'Generation 1' })).toContainText('Dwarka Vora');
  await expect(page.getByRole('region', { name: 'Generation 5' })).toContainText('Siya Vora');
  await expect(page.getByLabel('Family tree branches')).toContainText('Dwarka Vora');
});
