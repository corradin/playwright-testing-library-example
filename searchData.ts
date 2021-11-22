import { test as base } from '@playwright/test';

type SearchData = {
  search: string;
  location: string;
};

// Extend base test with our fixtures.
const test = base.extend<SearchData>({
  search: 'Cypress',
  location: 'Hilversum',
});

export default test;