import { test, expect } from '@playwright/test';
import testWithFixture from './searchData';

test.use({
  headless: false,
  launchOptions: { slowMo: 0 },
  viewport: { width: 1920, height: 1080 },
  storageState: undefined,
});

// A page property
test('should contain homepage title', async ({ page }) => {
  await page.goto('https://www.meetup.com');
  const title = await page.title();
  expect(title).toBe('Meetup - We are what we do');
});

// The first Selector
test('should contain header text', async ({ page }) => {
  await page.goto('https://www.meetup.com');
  const headerText = await page.locator('h1').textContent();
  expect(headerText).toBe('Celebrating 20 years of real connections on Meetup');
});

// Locale (This fails on Safari and could be a bug on meetup or in Playwright)
test('should contain header text based on locale', async ({ browser }) => {
  const context = await browser.newContext({
    locale: 'nl-NL',
  });
  const page = await context.newPage();
  await page.goto('https://www.meetup.com');
  const headerText = await page.locator('h1').textContent();
  expect(headerText).toBe('Tast toe! Er zijn talloze dingen te doen op Meetup');
});

// Selector chaining and debugging.
test('should return search result based on location', async ({ page }) => {
  await page.goto('https://www.meetup.com');
  // Only needed for firefox
  await page.mouse.wheel(0, 200);
  await page.fill(`[placeholder='Search for "tennis"']`, 'cypress');
  await page.fill(`[placeholder="Location"]`, 'Hilversum, NL');
  await page.click('text="Hilversum, Netherlands"');

  await Promise.all([page.waitForNavigation(), page.click('[value="Search"]')]);

  const firstResultTitleElement = await page.locator(
    '.max-w-narrow >> :nth-match(div, 1) >> p:has-text("Cypress Meetup")',
  );
  const title = await firstResultTitleElement.textContent();
  expect(title).toBe(
    'Cypress Meetup - Documenting your Cypress custom commands',
  );
});

// Fixture
testWithFixture(
  'should return search result based on location with fixtures',
  async ({ page, search, location }) => {
    await page.goto('https://www.meetup.com');
    await page.fill(`[placeholder='Search for "tennis"']`, search);
    await page.fill(`[placeholder="Location"]`, location);
  },
);

// Auto-wait Waiting for spinners (network request), set slowMo to 0
test('should return search result based on location with auto wait', async ({
  page,
}) => {
  await page.goto('https://www.meetup.com');
  // Only needed for firefox
  await page.mouse.wheel(0, 200);

  await page.fill(`[placeholder='Search for "tennis"']`, 'cypress');
  await page.fill(`[placeholder="Location"]`, 'Hilversum, NL');
  // When you have a spinner for a network request
  // const response = await page.waitForResponse('https://www.meetup.com/gql');
  // const responseData = await response.json();
  // expect(responseData.data.searchedLocations[0].name_string).toBe(
  //   'Hilversum, Netherlands',
  // );

  await page.click(
    '[data-testid="SearchTypeahead"] div:has-text("Hilversum, Netherlands")',
  );

  // Always try to test from a user perspective
  // await page.click('text="Hilversum, Netherlands"');

  await Promise.all([page.waitForNavigation(), page.click('[value="Search"]')]);

  const firstResultTitleElement = await page.locator(
    '.max-w-narrow >> :nth-match(div, 1) >> p:has-text("Cypress Meetup")',
  );
  const title = await firstResultTitleElement.textContent();
  expect(title).toBe(
    'Cypress Meetup - Documenting your Cypress custom commands',
  );
});

// Snapshot testing
test('should match search screenshot', async ({ page }) => {
  await page.goto('https://www.meetup.com');
  // Only needed for firefox
  await page.mouse.wheel(0, 200);

  await page.fill(`[placeholder='Search for "tennis"']`, 'cypress');
  await page.fill(`[placeholder="Location"]`, 'Hilversum, NL');

  // await page.screenshot({ path: 'search.png' });

  expect(await page.screenshot()).toMatchSnapshot('search.png');
});
