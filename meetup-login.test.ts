import { expect, test } from '@playwright/test';

test('Navigate to notifications', async ({ page }) => {
    await page.goto('https://www.meetup.com/notifications');
    await expect(page.getByText("This week")).toBeVisible();
});

test('Navigate to payment methods', async ({ page }) => {
    await page.goto('https://www.meetup.com/account/payment-methods');
    await expect(page.getByText("You don't have any saved cards for your organizer subscription")).toBeVisible();
});