import { test, expect } from '@playwright/test';

test.describe('MainContainer Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000'); // Adjust the URL to your local dev server
    });

    test('should display related questions', async ({ page }) => {
        // Simulate image upload and processing
        await page.setInputFiles('input[type="file"]', 'path/to/your/image.jpg');
        await page.click('button:has-text("Analyze Image")'); // Adjust the selector to match your button

        // Wait for the related questions to be populated
        await page.waitForSelector('ul.space-y-2 li button');

        const relatedQuestions = await page.$$eval('ul.space-y-2 li button', buttons => buttons.map(button => button.textContent));
        expect(relatedQuestions.length).toBeGreaterThan(0);
    });

    test('should handle related question click', async ({ page }) => {
        // Simulate image upload and processing
        await page.setInputFiles('input[type="file"]', 'path/to/your/image.jpg');
        await page.click('button:has-text("Analyze Image")'); // Adjust the selector to match your button

        // Wait for the related questions to be populated
        await page.waitForSelector('ul.space-y-2 li button');

        // Click the first related question button
        await page.click('ul.space-y-2 li button:first-child');

        // Add assertions to verify the behavior after clicking the button
        const toastMessage = await page.locator('.react-toast-notifications__toast__content').textContent();
        expect(toastMessage).toContain('sorusu cevaplanıyor');
    });
});