import { test, expect } from '@playwright/test';

test.describe('End-to-End Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000'); // Adjust the URL to your local dev server
    });

    test('should upload an image and display analysis results', async ({ page }) => {
        // Simulate image upload
        await page.setInputFiles('input[type="file"]', 'path/to/your/image.jpg');
        await page.click('button:has-text("Analyze Image")'); // Adjust the selector to match your button

        // Wait for the analysis results
        await page.waitForSelector('.analysis-result'); // Adjust the selector to match your result container

        const resultText = await page.locator('.analysis-result').textContent();
        expect(resultText).toBeDefined();
    });

    test('should regenerate content based on a keyword', async ({ page }) => {
        // Simulate image upload and processing
        await page.setInputFiles('input[type="file"]', 'path/to/your/image.jpg');
        await page.click('button:has-text("Analyze Image")'); // Adjust the selector to match your button

        // Wait for the keywords to be populated
        await page.waitForSelector('.keyword-button'); // Adjust the selector to match your keyword buttons

        // Click the first keyword button
        await page.click('.keyword-button:first-child');

        // Wait for the regenerated content
        await page.waitForSelector('.regenerated-content'); // Adjust the selector to match your regenerated content container

        const regeneratedText = await page.locator('.regenerated-content').textContent();
        expect(regeneratedText).toBeDefined();
    });
});