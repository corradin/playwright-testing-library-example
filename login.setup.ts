import { test as setup } from '@playwright/test';
import { storageStatePath } from './playwright.config';

const username = process.env.MEETUP_USERNAME ?? '';
const password = process.env.MEETUP_PASSWORD ?? '';

setup('Login a user', async ({ page }) => {
  await page.goto('https://www.meetup.com/login');
  await page.locator('id=email').fill(username);
  await page.locator('id=current-password').fill(password);

  await Promise.all([
    page.waitForNavigation(),
    page.locator('button[type=submit] >> "Log in"').click(),
  ]);

  await page.context().storageState({
    path: storageStatePath,
  });
});
