// spec: specs/career-visualizer-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Assignment and Experience Tags Management', () => {
  test('Add Assignment to Employment', async ({ page }) => {
    // Navigate to the Career & Experience Visualizer application
    await page.goto('https://qe-at-cgi-fi.github.io/experience-visualizer/');

    // Click 'Add Assignment' button within the employment
    await page.getByRole('button', { name: 'Add Assignment' }).click();

    // Fill Assignment Title with 'Test Automation Framework Development'
    await page.getByRole('textbox', { name: 'Assignment Title:' }).fill('Test Automation Framework Development');

    // Fill Description with 'Built comprehensive test automation suite using Playwright and Cypress for web application testing'
    await page.getByRole('textbox', { name: 'Description:' }).fill('Built comprehensive test automation suite using Playwright and Cypress for web application testing');

    // Set Start Date to '2023-03'
    await page.getByRole('textbox', { name: 'Start Date:' }).fill('2023-03');

    // Set End Date to '2023-09'
    await page.getByRole('textbox', { name: 'End Date:' }).fill('2023-09');

    // Click 'Save Assignment' button
    await page.getByRole('button', { name: 'Save Assignment' }).click();

    // Verify that the new assignment 'Test Automation Framework Development' is visible
    await expect(page.getByRole('heading', { name: 'Test Automation Framework' })).toBeVisible();

    // Verify that the assignments count shows '2' since we added a new assignment
    await expect(page.getByRole('heading', { name: 'Assignments (2)' })).toBeVisible();

    // Verify that the assignment date range 'Mar 2023 - Sep 2023' is displayed
    await expect(page.getByText('Mar 2023 - Sep 2023 (7 months)')).toBeVisible();

    // Verify that the assignment description is displayed correctly
    await expect(page.getByText('Built comprehensive test')).toBeVisible();
  });
});