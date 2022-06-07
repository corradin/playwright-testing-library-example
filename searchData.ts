import { test as base } from '@playwright/test';

type SearchData = {
  search: Array<string>;
  location: string;
};

// Extend base test with our fixtures.
const test = base.extend<SearchData>({
  search: ['Cypress', 'Playwright'],
  location: 'Hilversum',
});

export default test;