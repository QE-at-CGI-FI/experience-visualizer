// spec: specs/career-visualizer-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Core Employment Management', () => {
  test('Create New Employment Record', async ({ page }) => {
    // Navigate to the Career & Experience Visualizer application
    await page.goto('https://qe-at-cgi-fi.github.io/experience-visualizer/');

    // Verify the application loads successfully with correct header
    await expect(page.getByRole('heading', { name: 'Career & Experience Visualizer' })).toBeVisible();

    // Verify Employment History section is visible
    await expect(page.getByRole('heading', { name: 'Employment History' })).toBeVisible();

    // Click the 'Add Employment' button
    await page.getByRole('button', { name: 'Add Employment' }).click();

    // Verify Add Employment modal opens
    await expect(page.getByRole('button', { name: 'Add Employment' })).toBeVisible();

    // Fill Job Title field with 'Senior QA Engineer'
    await page.getByRole('textbox', { name: 'Job Title:' }).fill('Senior QA Engineer');

    // Fill Company field with 'Example Corp'
    await page.getByRole('textbox', { name: 'Company:' }).fill('Example Corp');

    // Fill Start Date field with '2023-01'
    await page.getByRole('textbox', { name: 'Start Date:' }).fill('2023-01');

    // Click 'Save Employment' button
    await page.getByRole('button', { name: 'Save Employment' }).click();

    // Verify new employment shows 'Senior QA Engineer' title
    await expect(page.locator('#employment-list').getByRole('heading', { name: 'Senior QA Engineer' })).toBeVisible();

    // Verify employment shows 'Example Corp' company
    await expect(page.locator('#employment-list').getByText('Example Corp')).toBeVisible();

    // Verify date shows 'Jan 2023 - Present'
    await expect(page.getByText('Jan 2023 - Present (3 years,').first()).toBeVisible();
  });
});