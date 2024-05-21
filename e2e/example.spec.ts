import { test, expect } from '@playwright/test';

test('Sign in and show data', async ({ page }) => {
  await page.goto('http://localhost:3000');

  await expect(page.getByText('Signin')).toBeVisible();

  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('qwerty');

  await page.getByText('Login').click();

  await expect(page.getByText('Your Todos')).toBeVisible();
});
