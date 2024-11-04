import { describe, test, beforeAll, afterAll, expect } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { clickElementByText, navigateToUrl } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';

describe('Reset Registry Button Display Check', () => {
    let driver;

    beforeAll(async () => {
        driver = await getChromeDriver();
        await navigateToUrl(driver, 'http://localhost:5173/');
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Verify that "Reset Registry" button is displayed', async () => {
        // Navigate to the "Reset Registry" page
        await clickElementByText(driver, 'Reset Registry');
        
        // Check that the "Reset Registry" button is displayed
        const resetButton = await driver.wait(until.elementLocated(By.xpath("//button[text()='Reset Registry']")), 5000);
        const isDisplayed = await resetButton.isDisplayed();
        
        expect(isDisplayed).toBe(true); // Verify the button is displayed
    });
});
