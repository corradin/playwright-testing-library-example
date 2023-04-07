import { test as setup } from '@playwright/test';
import { storageStatePath } from './playwright.config';

const username = process.env.MEETUP_USERNAME ?? '';
const password = process.env.MEETUP_PASSWORD ?? '';

setup('Login a user', async ({ page }) => {
  await page.goto('https://www.meetup.com/login');
  await page.getByLabel('Email').fill(username);
  await page.getByLabel('Password').first().fill(password);

  await Promise.all([
    page.waitForURL('https://www.meetup.com/home/**'),
    page.getByRole('button', { name: 'Log in',  exact: true}).click(),
  ]);

  await page.context().storageState({
    path: storageStatePath,
  });
});
