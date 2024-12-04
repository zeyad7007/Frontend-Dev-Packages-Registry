import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { fillInputField, waitForElement, clickElementByText, navigateToUrl } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';

declare global {
  interface Window {
    __coverage__: unknown;
  }
}

describe('Get Package by ID Functionality', () => {
    let driver;

    beforeAll(async () => {
        driver = await getChromeDriver();
        await navigateToUrl(driver, 'http://localhost:5173/home');
    });

    afterAll(async () => {
        // Fetch coverage from the browser and save it
        const coverage = await driver.executeScript(() => {
          return window.__coverage__;
        });
    
        if (coverage) {
          fs.writeFileSync('./.nyc_output/coverage-final.json', JSON.stringify(coverage));
        }
    
        await driver.quit();
      });

    test('Click on "Get Package by ID" and verify input field', async () => {
        await clickElementByText(driver, 'Get Package by ID');
        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Package ID']"));
        await waitForElement(driver, By.xpath("//button[text()='Fetch Package']"));
    });

    test('Fetch a package by ID with a GitHub URL and verify ID, Download button, and JavaScript Program', async () => {
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package ID']"), '255');
        await clickElementByText(driver, 'Fetch Package');

        const packageNameElement = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Test1')]")),
            5000
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", packageNameElement);

        // Check for ID
        const idElement = await driver.findElement(By.xpath("//*[contains(text(),'ID:')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", idElement);

        // Check for GitHub URL
        const githubUrlElement = await driver.findElement(By.xpath("//a[contains(@href, 'github.com')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", githubUrlElement);
        const githubUrl = await githubUrlElement.getAttribute('href');

        // Check for JavaScript Program
        const jsProgramElement = await driver.findElement(By.xpath("//*[contains(text(),'JavaScript Program:')]"));
        const jsProgramCode = await driver.findElement(By.xpath("//*[contains(text(),'console.log(\"Test1\");')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", jsProgramCode);

        // Check for Download button
        const downloadButton = await driver.findElement(By.xpath("//button[text()='Download']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", downloadButton);


        

        // Validate elements
        expect(await packageNameElement.getText()).toBe("Test1 (v1.0.0)");
        expect(await idElement.getText()).toBe("ID: 255");
        expect(githubUrl).toContain('https://github.com/abdelrahmanHamdyG/NPM-packages-Evaluator');
        expect(await jsProgramElement.isDisplayed()).toBe(true);
        expect(await jsProgramCode.getText()).toBe('console.log("Test1");');
        expect(await downloadButton.isDisplayed()).toBe(true);
    });

    test('Fetch a package by ID without a GitHub URL and verify ID, Download button, and JavaScript Program', async () => {
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package ID']"), '256');
        await clickElementByText(driver, 'Fetch Package');

        
        const packageNameElement = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Test2')]")),
            5000
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", packageNameElement);

        // Check for ID
        const idElement = await driver.findElement(By.xpath("//*[contains(text(),'ID:')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", idElement);

        // Ensure GitHub URL is not present
        const elements = await driver.findElements(By.xpath("//a[contains(@href, 'github.com')]"));

        // Check for JavaScript Program
        const jsProgramElement = await driver.findElement(By.xpath("//*[contains(text(),'JavaScript Program:')]"));
        const jsProgramCode = await driver.findElement(By.xpath("//*[contains(text(),'console.log(\"Test2\");')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", jsProgramCode);


        // Check for Download button
        const downloadButton = await driver.findElement(By.xpath("//button[text()='Download']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", downloadButton);

        
        // Validate elements
        expect(await packageNameElement.getText()).toBe("Test2 (v1.0.0)");
        expect(await idElement.getText()).toBe("ID: 256");
        expect(elements.length).toBe(0); // No GitHub URL
        expect(await jsProgramElement.isDisplayed()).toBe(true);
        expect(await jsProgramCode.getText()).toBe('console.log("Test2");');
        expect(await downloadButton.isDisplayed()).toBe(true);
    });

    test('Fetch a non-existing package by ID and verify error message', async () => {
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package ID']"), '0');
        await clickElementByText(driver, 'Fetch Package');

        // Wait for the error message by ID and verify content
        const errorMessageElement = await driver.wait(until.elementLocated(By.id("error")), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", errorMessageElement);

        const errorMessage = await errorMessageElement.getText();
        expect(errorMessage).toBe("Error 404: Package doesn't exist");
    });
});
