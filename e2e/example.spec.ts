import { test, expect } from '@playwright/test';

test('Sign in and show data', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await expect(page.getByText('Signin')).toBeVisible();

  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('qwerty');

  await page.getByText('Login').click();

  await expect(page.getByText('Your Todos')).toBeVisible();

  const items = page.locator('ul > li');
  await expect(items.nth(0)).toHaveText('Beer');
  await expect(items.nth(1)).toHaveText('Coffee');
});
