import { expect, test } from '@playwright/test';

test('Navigate to notifications', async ({ page }) => {
    console.log(process.env.MEETUP_USERNAME);
    await page.goto('https://www.meetup.com/notifications');
    await expect(page.locator(`"Nothing here yet"`).first()).toBeVisible();
});

test('Navigate to payment methods', async ({ page }) => {
    await page.goto('https://www.meetup.com/account/payment-methods');
    await expect(page.locator(`"You don't have any saved cards."`).first()).toBeVisible();
});