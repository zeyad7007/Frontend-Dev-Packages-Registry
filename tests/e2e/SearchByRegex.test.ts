import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { fillInputField, waitForElement, clickElementByText, navigateToUrl } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';

describe('Search by Regex Functionality', () => {
    let driver;

    beforeAll(async () => {
        driver = await getChromeDriver();
        await navigateToUrl(driver, 'http://localhost:5173/');
    });

    afterAll(async () => {
        await driver.quit();
    });

    test('Click on "Search by Regex" and verify input field', async () => {
        // Click on the "Search by Regex" button
        await clickElementByText(driver, 'Search by Regex');
        
        // Verify that the input field and "Search" button are visible
        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Regex']"));
        await waitForElement(driver, By.xpath("//button[text()='Search']"));
    });

    test('Enter a valid regex and retrieve matching packages', async () => {
        // Enter a valid regex that matches an existing package (e.g., "Test2")
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Regex']"), 'Test2');
        
        // Click on "Search" button
        await clickElementByText(driver, 'Search');
        
        // Wait for the package details to load
        const packageNameElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Test2')]")), 10000);
        const packageVersionElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Version:')]")), 10000);

        // Verify the package details
        expect(await packageNameElement.getText()).toBe('Test2');
        expect(await packageVersionElement.getText()).toBe('Version: 1.0.0');
    });

    test('Enter a non-existing regex and verify error message', async () => {
        // Enter a regex that does not match any package (e.g., "NotExistingRegex")
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Regex']"), 'NotExistingRegex');
        
        // Click on "Search" button
        await clickElementByText(driver, 'Search');
        
        // Wait for the error message to appear by ID and verify content
        const errorMessageElement = await driver.wait(until.elementLocated(By.id("error")), 10000);
        const errorMessage = await errorMessageElement.getText();
        
        expect(errorMessage).toBe("Error 404: No package found under this regex");
    });
});
