// spec: specs/career-visualizer-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

const APP_URL = '/';

test.describe('Client Profiles', () => {
  test('Tag an assignment with V26 requirements and a client-specific description', async ({ page }) => {
    await page.goto(APP_URL);
    await expect(page.locator('#employment-list')).toContainText('Web Application Development');

    // No client sections are shown until a profile is selected
    await expect(page.locator('#client-requirements-section')).toBeHidden();

    await page.getByLabel('Client profile').selectOption('V26');
    await expect(page.locator('#client-requirements-section')).toBeVisible();
    await expect(page.locator('#client-requirements')).toContainText('M2.9');

    // Edit the seeded assignment and tag it with V26 requirements
    await page.locator('.client-section').getByRole('button', { name: 'Edit V26' }).click();
    // The seeded assignment stores a full date that the month input cannot show, so re-enter it
    await page.getByRole('textbox', { name: 'Start Date:' }).fill('2023-01');
    await page.getByRole('textbox', { name: 'V26 description:' }).fill('Fasilitoin yhteiskehittämisen työpajoja.');
    await page.getByRole('checkbox', { name: /M2\.3/ }).check();
    await page.getByRole('checkbox', { name: /S4/ }).check();
    await page.getByRole('button', { name: 'Save Assignment' }).click();

    const clientSection = page.locator('.client-section');
    await expect(clientSection).toContainText('V26 Requirements (2)');
    await expect(clientSection).toContainText('Fasilitoin yhteiskehittämisen työpajoja.');
    await expect(clientSection).toContainText('M2.3');
    await expect(clientSection).toContainText('S4');

    // Coverage table lists the assignment under the tagged requirement
    const m23Row = page.locator('.client-requirements-table tr', { has: page.locator('.req-code', { hasText: /^M2\.3$/ }) });
    await expect(m23Row).toContainText('Web Application Development');

    // Removing a requirement chip updates the assignment
    await clientSection.locator('.client-requirement', { hasText: 'S4' }).getByRole('button', { name: '×' }).click();
    await expect(clientSection).toContainText('V26 Requirements (1)');

    // Switching the profile off hides client-specific content
    await page.getByLabel('Client profile').selectOption('');
    await expect(page.locator('.client-section')).toHaveCount(0);
    await expect(page.locator('#client-requirements-section')).toBeHidden();
  });

  test('Convert code-named skill tags into V26 requirements', async ({ page }) => {
    await page.goto(APP_URL);
    await expect(page.locator('#employment-list')).toContainText('Web Application Development');

    // Add a skill tag using the old naming convention
    await page.getByRole('button', { name: 'Add Tag' }).click();
    await page.getByRole('textbox', { name: 'Tag Name:' }).fill('M2.1 Laadullinen käyttäjätutkimus');
    await page.getByLabel('Category:').selectOption('skill');
    await page.getByRole('button', { name: 'Save Tag' }).click();

    await page.getByLabel('Client profile').selectOption('V26');
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Convert 1 code-named tag to V26 requirements' }).click();

    await expect(page.locator('.client-section')).toContainText('M2.1');
    await expect(page.locator('.tags-list').last()).not.toContainText('M2.1 Laadullinen');
    await expect(page.locator('#convert-client-tags-btn')).toBeHidden();
  });
});
