// spec: specs/career-visualizer-test-plan.md

import { test, expect } from '@playwright/test';

test.describe('Core Employment Management', () => {
  test('Edit Existing Employment Record', async ({ page }) => {
    // Navigate to the Career & Experience Visualizer application
    await page.goto('https://qe-at-cgi-fi.github.io/experience-visualizer/');

    // Locate an existing employment record and click 'Edit' button
    await page.getByRole('button', { name: 'Edit' }).first().click();

    // Verify Edit Employment modal opens
    await expect(page.getByRole('heading', { name: 'Edit Employment' })).toBeVisible();

    // Modify the Job Title to 'Lead QA Engineer'
    await page.getByRole('textbox', { name: 'Job Title:' }).fill('Lead QA Engineer');

    // Update End Date to '2024-12'
    await page.getByRole('textbox', { name: 'End Date:' }).fill('2024-12');

    // Fill the Start Date field to ensure form is complete
    await page.getByRole('textbox', { name: 'Start Date:' }).fill('2023-01');

    // Click 'Save Employment' button
    await page.getByRole('button', { name: 'Save Employment' }).click();

    // Verify employment record shows updated job title 'Lead QA Engineer'
    await expect(page.locator('#employment-list').getByRole('heading', { name: 'Lead QA Engineer' })).toBeVisible();

    // Verify date range is updated correctly to Jan 2023 - Dec 2024
    await expect(page.locator('#employment-list').getByText('Jan 2023 - Dec 2024 (2 years)')).toBeVisible();
  });
});