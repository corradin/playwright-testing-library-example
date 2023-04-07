import { Page } from '@playwright/test';

async function login(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.goto('https://www.meetup.com/login');
  await page.getByLabel('Email').fill(username);
  await page.getByLabel('Password', { exact: true }).fill(password);

  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await page.waitForURL('https://www.meetup.com/home/**');
}

export default login;
