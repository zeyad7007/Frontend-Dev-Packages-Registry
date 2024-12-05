import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { fillInputField, waitForElement, clickElementByText, navigateToUrl } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';
import path from 'path';
import fs from 'fs';


declare global { 
    interface Window {
      __coverage__: unknown;
    }
  }
describe('Upload Package Functionality', () => {
    let driver;

    beforeAll(async () => {
        driver = await getChromeDriver();
        await navigateToUrl(driver, 'https://frontend-dev-packages-registry.vercel.app/home');
        await clickElementByText(driver, 'Upload Package');
        // Perform login
        const usernameInput = await driver.findElement(By.id('username-input')); 
        const passwordInput = await driver.findElement(By.id('password-input')); 
        const loginButton = await driver.findElement(By.id('authenticate-button')); 

        await driver.executeScript('arguments[0].scrollIntoView(true);', usernameInput);
        await fillInputField(driver, By.id('username-input'), 'adminUser'); 
        await driver.executeScript('arguments[0].scrollIntoView(true);', passwordInput);
        await fillInputField(driver, By.id('password-input'), 'adminPassword123'); 
        await driver.executeScript('arguments[0].scrollIntoView(true);', loginButton);
        await driver.wait(until.elementIsVisible(loginButton), 5000);
        await driver.executeScript('arguments[0].click();', loginButton);
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

    test('Verify UI elements appear after clicking Upload Package', async () => {
        // Verify UI elements
        await waitForElement(driver, By.xpath("//input[@placeholder='Package Name']"));
        await waitForElement(driver, By.xpath("//textarea[@placeholder='JS Program']"));
        await waitForElement(driver, By.xpath("//input[@placeholder='GitHub Repo URL']"));
        await waitForElement(driver, By.xpath("//input[@type='file']"));
        await waitForElement(driver, By.xpath("//button[text()='Upload Package']"));
    });

    test('Missing fields or malformed data error (Error 400)', async () => {
        const packageName = 'invalid package';
        await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), packageName);
        await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("malformed data");');
        await fillInputField(driver, By.xpath("//input[@placeholder='GitHub Repo URL']"), '');
    
        const debloatCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox' and @name='debloat']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", debloatCheckbox);
        if (!(await debloatCheckbox.isSelected())) {
            await debloatCheckbox.click();
        }
    
        const uploadButton = await driver.findElement(By.xpath("//button[text()='Upload Package']"));
    
        // Scroll to the button and wait for it to be clickable
        await driver.executeScript("arguments[0].scrollIntoView(true);", uploadButton);
        await driver.wait(until.elementIsVisible(uploadButton), 5000);
        await driver.wait(until.elementIsEnabled(uploadButton), 5000);
    
        try {
            // Attempt to click the button
            await uploadButton.click();
        } catch (e) {
            if (e.name === 'ElementClickInterceptedError') {
                // Fallback: Force click via JavaScript if obstructed
                await driver.executeScript("arguments[0].click();", uploadButton);
            } else {
                throw e; // Re-throw if it's not the intercepted error
            }
        }
    
        const errorMessage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Error 400: There is a missing field(s)')]")),
            5000
        );
        const messageText = await errorMessage.getText();
        expect(messageText).toContain('Error 400: There is a missing field(s)');
    });
    

    test('Upload package using base64 ZIP file', async () => {
        const packageName = `TestPackageFile_${Date.now()}`;
        await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), packageName);
        await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("Base64 Upload Test");');

        const debloatCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox' and @name='debloat']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", debloatCheckbox);
        if (!(await debloatCheckbox.isSelected())) {
            await debloatCheckbox.click();
        }

        const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
        const filePath = path.resolve(__dirname, 'Test1-1.0.0.zip');
        await fileInput.sendKeys(filePath);

        const uploadButton = await driver.findElement(By.xpath("//button[text()='Upload Package']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", uploadButton);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await driver.wait(until.elementIsVisible(uploadButton), 5000);
        await driver.wait(until.elementIsEnabled(uploadButton), 5000);
        await driver.executeScript("arguments[0].click();", uploadButton); 

        const successMessage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Package uploaded with ID:')]")),
            10000
        );
        const messageText = await successMessage.getText();
        expect(messageText).toContain('Package uploaded with ID:');
    });

    test('Upload package using GitHub repository URL', async () => {
        const packageName = `TestPackageRepo_${Date.now()}`;
        await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), packageName);
        await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("GitHub URL Upload Test");');
        await fillInputField(driver, By.xpath("//input[@placeholder='GitHub Repo URL']"), 'https://github.com/abdelrahmanHamdyG/NPM-packages-Evaluator');

        const debloatCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox' and @name='debloat']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", debloatCheckbox);
        if (!(await debloatCheckbox.isSelected())) {
            await debloatCheckbox.click();
        }

        const uploadButton = await driver.findElement(By.xpath("//button[text()='Upload Package']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", uploadButton);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await driver.wait(until.elementIsVisible(uploadButton), 5000);
        await driver.wait(until.elementIsEnabled(uploadButton), 5000);
        await driver.executeScript("arguments[0].click();", uploadButton); 

        const successMessage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Package uploaded with ID:')]")),
            10000
        );
        const messageText = await successMessage.getText();
        expect(messageText).toContain('Package uploaded with ID:');
    });

    test('Disqualified package error (Error 424)', async () => {
        const packageName = 'disqualified package';
        await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), packageName);
        await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("disqualified package");');
        await fillInputField(driver, By.xpath("//input[@placeholder='GitHub Repo URL']"), 'https://github.com/abdelrahmanHamdyG/Books-Exchange-App');

        const debloatCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox' and @name='debloat']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", debloatCheckbox);
        if (!(await debloatCheckbox.isSelected())) {
            await debloatCheckbox.click();
        }

        const uploadButton = await driver.findElement(By.xpath("//button[text()='Upload Package']"));
        await uploadButton.click();

        const errorMessage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Error 424: disqualified package')]")),
            5000
        );
        const messageText = await errorMessage.getText();
        expect(messageText).toContain('Error 424: disqualified package');
    });

    test('Duplicate package error (Error 409)', async () => {
        const packageName = 'Test1';
        await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), packageName);
        await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("duplicate package");');
        await fillInputField(driver, By.xpath("//input[@placeholder='GitHub Repo URL']"), 'https://github.com/abdelrahmanHamdyG/NPM-packages-Evaluator');

        const debloatCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox' and @name='debloat']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", debloatCheckbox);
        if (!(await debloatCheckbox.isSelected())) {
            await debloatCheckbox.click();
        }

        const uploadButton = await driver.findElement(By.xpath("//button[text()='Upload Package']"));
        await uploadButton.click();

        const errorMessage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Error 409: Package exists already')]")),
            5000
        );
        const messageText = await errorMessage.getText();
        expect(messageText).toContain('Error 409: Package exists already');
    });

   

});
