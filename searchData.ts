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

// Now, this "test" can be used in multiple test files, and each of them will get the fixtures.
export default test;

// export const cypressHilversum: SearchData = {
//   search: 'Cypress',
//   location: 'Hilversum',
// };
