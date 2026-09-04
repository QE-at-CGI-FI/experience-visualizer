// spec: specs/career-visualizer-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect, type Page } from '@playwright/test';

// This feature is exercised against the local working copy (see `webServer` /
// `baseURL` in playwright.config.js) so it can be verified before deployment.
const APP_URL = '/';

// Adds an employment record through the header "Add Employment" modal.
async function addEmployment(
  page: Page,
  { title, company, startDate }: { title: string; company: string; startDate: string },
) {
  await page.getByRole('button', { name: 'Add Employment' }).click();
  await page.getByRole('textbox', { name: 'Job Title:' }).fill(title);
  await page.getByRole('textbox', { name: 'Company:' }).fill(company);
  await page.getByRole('textbox', { name: 'Start Date:' }).fill(startDate);
  await page.getByRole('button', { name: 'Save Employment' }).click();
}

test.describe('Filtering and Navigation', () => {
  test('Filter Employment History and Timeline by Employer', async ({ page }) => {
    // Navigate to the Career & Experience Visualizer application
    await page.goto(APP_URL);

    // Wait for the seeded employment ('Tech Innovations Inc.') to be present
    await expect(page.locator('#employment-list')).toContainText('Tech Innovations Inc.');

    // Add a second employment at a different company
    await addEmployment(page, { title: 'Test Consultant', company: 'CGI Finland', startDate: '2022-01' });

    // The employer filter dropdown lists both companies plus the default option
    const employerFilter = page.getByLabel('Filter by employer');
    await expect(employerFilter).toContainText('All employers');
    await expect(employerFilter).toContainText('CGI Finland');
    await expect(employerFilter).toContainText('Tech Innovations Inc.');

    // With no filter applied, both employments and both timeline entries are visible
    await expect(page.locator('#employment-list')).toContainText('CGI Finland');
    await expect(page.locator('#employment-list')).toContainText('Tech Innovations Inc.');
    await expect(page.locator('#timeline')).toContainText('CGI Finland');
    await expect(page.locator('#timeline')).toContainText('Tech Innovations Inc.');

    // Select 'CGI Finland' from the employer filter
    await employerFilter.selectOption('CGI Finland');

    // Only the CGI Finland employment and timeline entry remain
    await expect(page.locator('#employment-list')).toContainText('CGI Finland');
    await expect(page.locator('#employment-list')).not.toContainText('Tech Innovations Inc.');
    await expect(page.locator('#timeline')).toContainText('CGI Finland');
    await expect(page.locator('#timeline')).not.toContainText('Tech Innovations Inc.');

    // Switch the filter to the other employer
    await employerFilter.selectOption('Tech Innovations Inc.');

    // Only the Tech Innovations Inc. employment and timeline entry remain
    await expect(page.locator('#employment-list')).toContainText('Tech Innovations Inc.');
    await expect(page.locator('#employment-list')).not.toContainText('CGI Finland');
    await expect(page.locator('#timeline')).toContainText('Tech Innovations Inc.');
    await expect(page.locator('#timeline')).not.toContainText('CGI Finland');

    // Reset the filter back to 'All employers'
    await employerFilter.selectOption('__all__');

    // Both employments and timeline entries are visible again
    await expect(page.locator('#employment-list')).toContainText('CGI Finland');
    await expect(page.locator('#employment-list')).toContainText('Tech Innovations Inc.');
    await expect(page.locator('#timeline')).toContainText('CGI Finland');
    await expect(page.locator('#timeline')).toContainText('Tech Innovations Inc.');
  });

  test('Employer Filter Scopes the Experience Tags Overview', async ({ page }) => {
    // Navigate to the Career & Experience Visualizer application
    await page.goto(APP_URL);

    // The seeded assignment contributes three tags to the Experience Tags Overview
    await expect(page.locator('#tags-cloud')).toContainText('React');
    await expect(page.locator('#tags-cloud')).toContainText('Jest');
    await expect(page.locator('#tags-cloud')).toContainText('Team Leadership');

    // Add a second employment that has no assignments or tags
    await addEmployment(page, { title: 'Data Analyst', company: 'Globex', startDate: '2021-06' });

    // Filter to the employer with no tagged experience
    await page.getByLabel('Filter by employer').selectOption('Globex');

    // Employment History is scoped to Globex and the Tags Overview shows the empty state
    await expect(page.locator('#employment-list')).toContainText('Globex');
    await expect(page.locator('#employment-list')).not.toContainText('Tech Innovations Inc.');
    await expect(page.locator('#tags-cloud')).toContainText('No experience tags found');
    await expect(page.locator('#tags-cloud')).not.toContainText('React');

    // Filter back to the seeded employer and the tags reappear
    await page.getByLabel('Filter by employer').selectOption('Tech Innovations Inc.');
    await expect(page.locator('#tags-cloud')).toContainText('React');
    await expect(page.locator('#tags-cloud')).toContainText('Jest');
    await expect(page.locator('#tags-cloud')).toContainText('Team Leadership');
  });

  test('Deleting the Selected Employer Resets the Filter to All Employers', async ({ page }) => {
    // Navigate to the Career & Experience Visualizer application
    await page.goto(APP_URL);

    // Wait for the seeded employment to be present
    await expect(page.locator('#employment-list')).toContainText('Tech Innovations Inc.');

    // Add a throwaway employment and filter the views down to it
    await addEmployment(page, { title: 'Contractor', company: 'ShortCorp', startDate: '2020-02' });
    const employerFilter = page.getByLabel('Filter by employer');
    await employerFilter.selectOption('ShortCorp');
    await expect(employerFilter).toHaveValue('ShortCorp');
    await expect(page.locator('#employment-list')).not.toContainText('Tech Innovations Inc.');

    // Delete the currently filtered employment (confirm the browser dialog)
    page.once('dialog', (dialog) => dialog.accept());
    await page
      .locator('.employment-card', { hasText: 'ShortCorp' })
      .locator('.employment-header')
      .getByRole('button', { name: 'Delete' })
      .click();

    // The filter falls back to 'All employers' and its option is removed
    await expect(employerFilter).toHaveValue('__all__');
    await expect(employerFilter).not.toContainText('ShortCorp');

    // The remaining employment is shown again across the views
    await expect(page.locator('#employment-list')).toContainText('Tech Innovations Inc.');
    await expect(page.locator('#employment-list')).not.toContainText('ShortCorp');
    await expect(page.locator('#timeline')).toContainText('Tech Innovations Inc.');
  });
});
