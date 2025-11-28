import { test, expect } from '@playwright/test';

test.describe('Navigation Flows', () => {
    test('should navigate from Landing Page to Lobby', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });

        // Wait for hero section to be visible
        await page.waitForSelector('h1', { state: 'visible', timeout: 10000 });

        // Click Play Now
        await page.getByRole('link', { name: /PLAY NOW/i }).click();

        // Verify URL and Lobby Content
        await expect(page).toHaveURL('/lobby');
        await page.waitForSelector('text=Lobby', { timeout: 10000 });
        await expect(page.getByText('Join a table and start winning $ANTE')).toBeVisible();
    });

    test('should navigate to Tournaments page', async ({ page }) => {
        await page.goto('/lobby');

        // Click Tournaments Link
        await page.getByRole('link', { name: /tournaments/i }).click();

        // Verify URL and Content
        await expect(page).toHaveURL('/tournaments');
        await expect(page.getByRole('heading', { name: 'Tournaments' })).toBeVisible();
    });

    test('should navigate to Leaderboard page', async ({ page }) => {
        await page.goto('/lobby');

        // Click Leaderboard Link
        await page.getByRole('link', { name: /leaderboard/i }).click();

        // Verify URL and Content
        await expect(page).toHaveURL('/leaderboard');
        await expect(page.getByRole('heading', { name: 'Global Rankings' })).toBeVisible();
    });

    test('should navigate to Profile page', async ({ page }) => {
        await page.goto('/lobby');

        // Click Profile Link
        await page.getByRole('link', { name: /profile/i }).click();

        // Verify URL and Content
        await expect(page).toHaveURL('/profile');
        await expect(page.getByText('Total Earnings')).toBeVisible();
    });

    test('should navigate back to Home from Logo', async ({ page }) => {
        await page.goto('/tournaments');

        // Click Logo
        await page.locator('a[href="/"]').first().click();

        // Verify URL goes back to home
        await expect(page).toHaveURL('/');
    });
});
