import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { getChromeDriver } from './SeleniumSetup';
import { fillInputField, waitForElement, clickElementByText, clickElementById } from './NavigationHelper';
import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';

declare global {
  interface Window {
    __coverage__: unknown;
  }
}

describe('All Tests', () => {
    let driver;
    const uploadedPackage = { id: '', name: '', version: '', JSProgram: '', githubURL: '' };
    const uploadedPackage2 = { id: '', name: '', version: '', JSProgram: '', githubURL: '' };
    beforeAll(async () => {
        // await driver.manage().setTimeouts({ implicit: 20000 }); // Set 20 seconds for all implicit waits

        driver = await getChromeDriver();
        await driver.get('https://frontend-dev-packages-registry.vercel.app/');
        // await driver.get('http://localhost:5173/home');
        await clickElementByText(driver, 'Login');

        // Perform login
        const usernameInput = await driver.findElement(By.id('username-input')); 
        const passwordInput = await driver.findElement(By.id('password-input')); 
        const loginButton = await driver.findElement(By.id('authenticate-button')); 

        await driver.executeScript('arguments[0].scrollIntoView(true);', usernameInput);
        await fillInputField(driver, By.id('username-input'), 'ece30861defaultadminuser'); 
        await driver.executeScript('arguments[0].scrollIntoView(true);', passwordInput);
        await fillInputField(driver, By.id('password-input'), 'correcthorsebatterystaple123(!__+@**(A\'"`;DROP TABLE packages;'); 
        await driver.executeScript('arguments[0].scrollIntoView(true);', loginButton);
        await driver.wait(until.elementIsVisible(loginButton), 5000);
        await driver.executeScript('arguments[0].click();', loginButton);
        await new Promise(resolve => setTimeout(resolve, 1000));

        
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

      test('Verify that "Reset Registry" button is displayed', async () => {
        // Navigate to the "Reset Registry" page
        await clickElementByText(driver, 'Reset Registry');
        
        // Check that the "Reset Registry" button is displayed
        const resetButton = await driver.wait(until.elementLocated(By.xpath("//button[text()='Reset Registry']")), 5000);
        const isDisplayed = await resetButton.isDisplayed();
        await clickElementById(driver, 'Reset');
        const successMessage = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Registry has been reset successfully.')]")),
            10000
        );
        const messageText = await successMessage.getText();
        expect(messageText).toContain('Registry has been reset successfully.');
        expect(isDisplayed).toBe(true); // Verify the button is displayed

    });

    test('Verify UI elements appear after clicking Upload Package', async () => {
        // Verify UI elements.
        await clickElementByText(driver, 'Upload Package');
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
        const packageName = `Test2`;
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
        const idMatch = messageText.match(/ID: (\d+)/);
        uploadedPackage2.id = idMatch ? idMatch[1] : '';
        expect(messageText).toContain('Package uploaded with ID:');
    });

    

    test('Upload package using GitHub repository URL', async () => {
        const packageName = `express`;
        await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), packageName);
        await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("GitHub URL Upload Test");');
        await fillInputField(driver, By.xpath("//input[@placeholder='GitHub Repo URL']"), 'https://github.com/expressjs/express');

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
        
        const successMessage2 = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Package uploaded with ID:')]")),
            20000
        ); // Wait for the element to be located within 20 seconds

        const messageText = await successMessage2.getText();
        const idMatch = messageText.match(/ID: (\d+)/);
        uploadedPackage.id = idMatch ? idMatch[1] : '';
        expect(messageText).toContain('Package uploaded with ID:');
    });

    // test('Disqualified package error (Error 424)', async () => {
    //     const packageName = 'disqualified package';
    //     await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), packageName);
    //     await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("disqualified package");');
    //     await fillInputField(driver, By.xpath("//input[@placeholder='GitHub Repo URL']"), 'https://github.com/abdelrahmanHamdyG/Books-Exchange-App');

    //     const debloatCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox' and @name='debloat']"));
    //     await driver.executeScript("arguments[0].scrollIntoView(true);", debloatCheckbox);
    //     if (!(await debloatCheckbox.isSelected())) {
    //         await debloatCheckbox.click();
    //     }

    //     const uploadButton = await driver.findElement(By.xpath("//button[text()='Upload Package']"));
    //     await uploadButton.click();

    //     const errorMessage = await driver.wait(
    //         until.elementLocated(By.xpath("//*[contains(text(),'Error 424: disqualified package')]")),
    //         5000
    //     );
    //     const messageText = await errorMessage.getText();
    //     expect(messageText).toContain('Error 424: disqualified package');
    // });

    // test('Duplicate package error (Error 409)', async () => {
    //     const packageName = 'Test1';
    //     await fillInputField(driver, By.xpath("//input[@placeholder='Package Name']"), packageName);
    //     await fillInputField(driver, By.xpath("//textarea[@placeholder='JS Program']"), 'console.log("duplicate package");');
    //     await fillInputField(driver, By.xpath("//input[@placeholder='GitHub Repo URL']"), 'https://github.com/expressjs/express');

    //     const debloatCheckbox = await driver.findElement(By.xpath("//input[@type='checkbox' and @name='debloat']"));
    //     await driver.executeScript("arguments[0].scrollIntoView(true);", debloatCheckbox);
    //     if (!(await debloatCheckbox.isSelected())) {
    //         await debloatCheckbox.click();
    //     }

    //     const uploadButton = await driver.findElement(By.xpath("//button[text()='Upload Package']"));
    //     await uploadButton.click();

    //     const errorMessage = await driver.wait(
    //         until.elementLocated(By.xpath("//*[contains(text(),'Error 409: Package exists already')]")),
    //         5000
    //     );
    //     const messageText = await errorMessage.getText();
    //     expect(messageText).toContain('Error 409: Package exists already');
    // });




    test('Verify all components appear when "Get Package Cost" is clicked', async () => {
        // Click on the "Get Package Cost" button
        await clickElementByText(driver, 'Get Package Cost');


        const components = [
            { id: 'package-id-input' }, 
            { id: 'fetch-cost-button' } 
        ];

        // Verify that all components are displayed and scroll into view
        for (const component of components) {
            const element = await driver.wait(until.elementLocated(By.id(component.id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", element);
            expect(await element.isDisplayed()).toBe(true);
        }
    });

    test('Verify all components appear when "Get Package Rating" is clicked', async () => {
        // Click on the "Get Package Rating" button
        await clickElementByText(driver, 'Get Package Rating');

        // Verify and scroll to all components
        const elements = [
            "package-id-input",  
            "fetch-rating-button", 
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Open Get Packages and verify UI elements', async () => {
        await clickElementByText(driver, 'Get Packages');

        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Package Name']"));
        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Version']"));
        await waitForElement(driver, By.xpath("//button[text()='Add Another Query']"));
        await waitForElement(driver, By.xpath("//button[text()='Remove']"));
        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Offset']"));
        await waitForElement(driver, By.xpath("//button[text()='Load Packages']"));
    });

    test('Retrieve a package by name, version, and offset', async () => {
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package Name']"), 'Test2');
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Version']"), '1.0.0');
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Offset']"), '0');
        
        const loadButton = await driver.findElement(By.xpath("//button[text()='Load Packages']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", loadButton);
        await driver.wait(until.elementIsVisible(loadButton), 5000);
        await driver.executeScript("arguments[0].click();", loadButton);
    
        const packageNameElement = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Test2')]")),
            5000
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", packageNameElement);
    
        const versionLabelElement = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'Version:')]")),
            5000
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", versionLabelElement);
    
        const packageName = await packageNameElement.getText();
        const packageVersionLabel = await versionLabelElement.getText();
    
        expect(packageName).toContain('Test2');
        expect(packageVersionLabel).toBe('Version: 1.0.0');
    }, 5000);
    
    test('Handle invalid package retrieval', async () => {
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package Name']"), 'InvalidPackage');
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Version']"), '0.0.0');
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Offset']"), '0');

        const loadButton = await driver.findElement(By.xpath("//button[text()='Load Packages']"));
        
        await driver.executeScript("arguments[0].scrollIntoView(true);", loadButton);
        await driver.wait(until.elementIsVisible(loadButton), 5000);
        await driver.executeScript("arguments[0].click();", loadButton);

        await waitForElement(driver, By.xpath("//*[contains(text(),'No packages found')]")); 
        const errorMessage = await driver.findElement(By.xpath("//*[contains(text(),'No packages found')]")).getText();
        expect(errorMessage).toBe('No packages found'); 
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
        const packageNameElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Test2')]")), 5000);
        const packageVersionElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Version:')]")), 5000);

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
        const errorMessageElement = await driver.wait(until.elementLocated(By.id("error")), 5000);
        const errorMessage = await errorMessageElement.getText();
        
        expect(errorMessage).toBe("Error 404: No package found under this regex");
    });

    test('Verify all components appear when "Update Package by ID" is clicked', async () => {
        // Click on the "Update Package by ID" button
        await clickElementByText(driver, 'Update Package by ID');

        // Verify and scroll to all components by ID
        const elements = [
            "package-id-input",       
            "package-name-input",      
            "package-version-input",  
            "debloat-checkbox",        
            "js-program-textarea",    
            "github-url-input",       
            "file-upload",             
            "update-package-button",   
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Click on "Get Package by ID" and verify input field', async () => {

        await clickElementByText(driver, 'Get Package by ID');
        
        await waitForElement(driver, By.xpath("//input[@placeholder='Enter Package ID']"));
        await waitForElement(driver, By.xpath("//button[text()='Fetch Package']"));
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

    test('wait', async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
    });

    test('Fetch a package by ID without a GitHub URL and verify ID, Download button, and JavaScript Program', async () => {
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package ID']"), uploadedPackage2.id);
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
        const jsProgramCode = await driver.findElement(By.xpath("//*[contains(text(),'console.log(\"Base64 Upload Test\");')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", jsProgramCode);


        // Check for Download button
        const downloadButton = await driver.findElement(By.xpath("//button[text()='Download']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", downloadButton);

        
        // Validate elements
        expect(await packageNameElement.getText()).toBe("Test2 (v1.0.0)");
        expect(await idElement.getText()).toBe(`ID: ${uploadedPackage2.id}`);
        expect(elements.length).toBe(0); // No GitHub URL
        expect(await jsProgramElement.isDisplayed()).toBe(true);
        expect(await jsProgramCode.getText()).toBe('console.log("Base64 Upload Test");');
        expect(await downloadButton.isDisplayed()).toBe(true);
    });
    test('Fetch a package by ID with a GitHub URL and verify ID, Download button, and JavaScript Program', async () => {
        const incrementedId = (parseInt(uploadedPackage.id, 10) + 1).toString();
        await fillInputField(driver, By.xpath("//input[@placeholder='Enter Package ID']"), incrementedId);
        await clickElementByText(driver, 'Fetch Package');

        const packageNameElement = await driver.wait(
            until.elementLocated(By.xpath("//*[contains(text(),'express')]")),
            5000
        );
        await driver.executeScript("arguments[0].scrollIntoView(true);", packageNameElement);

        // Check for ID
        // const idElement = await driver.findElement(By.xpath("//*[contains(text(),'ID:')]"));
        const idElement = await driver.findElement(By.id('iddd'));

        await driver.executeScript("arguments[0].scrollIntoView(true);", idElement);

        // Check for GitHub URL
        const githubUrlElement = await driver.findElement(By.xpath("//a[contains(@href, 'github.com')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", githubUrlElement);
        const githubUrl = await githubUrlElement.getAttribute('href');

        // Check for JavaScript Program
        const jsProgramElement = await driver.findElement(By.xpath("//*[contains(text(),'JavaScript Program:')]"));
        const jsProgramCode = await driver.findElement(By.xpath("//*[contains(text(),'console.log(\"GitHub URL Upload Test\");')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", jsProgramCode);

        // Check for Download button
        const downloadButton = await driver.findElement(By.xpath("//button[text()='Download']"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", downloadButton);


        

        // Validate elements
        expect(await packageNameElement.getText()).toBe("express (v1.0.0)");
        expect(await idElement.getText()).toBe(`ID: ${incrementedId}`);
        expect(githubUrl).toContain('https://github.com/expressjs/express');
        expect(await jsProgramElement.isDisplayed()).toBe(true);
        expect(await jsProgramCode.getText()).toBe('console.log("GitHub URL Upload Test");');
        expect(await downloadButton.isDisplayed()).toBe(true);
    });

    test('Verify Assign User form elements', async () => {
        await clickElementByText(driver, 'Admin Actions');
        await clickElementByText(driver, 'Assign User to Group');
        const userIdInput = await driver.findElement(By.id('userIdInput'));
        const groupIdInput = await driver.findElement(By.id('groupIdInput'));
        const assignButton = await driver.findElement(By.id('submitButton'));
    
        await driver.executeScript('arguments[0].scrollIntoView(true);', userIdInput);
        expect(await userIdInput.isDisplayed()).toBe(true);
    
        await driver.executeScript('arguments[0].scrollIntoView(true);', groupIdInput);
        expect(await groupIdInput.isDisplayed()).toBe(true);
    
        await driver.executeScript('arguments[0].scrollIntoView(true);', assignButton);
        expect(await assignButton.isDisplayed()).toBe(true);
      });

      test('Verify Update Permissions form elements', async () => {
        await clickElementByText(driver, 'Update Permissions');

        // Verify and scroll to all components
        const elements = [
            "updatePermissionsHeader",
            "user",
            "permissions",
            "download",
            "search",
            "upload",
            "userId",  
            "canDownload",
            "canSearch",
            "canUpload",
            "updatePermissionsButton" 
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Verify Get Permissions form elements', async () => {
        await clickElementByText(driver, 'Get Permissions');

        // Verify and scroll to all components
        const elements = [
            "getPermissionsHeader",
            "user",
            "userIdInput",  
            "getPermissionsButton" 
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Verify Register User form elements', async () => {
        await clickElementByText(driver, 'Register User');

        // Verify and scroll to all components
        const elements = [
            "RegisterUserHeader",
            "name",  
            "password",
            "isAdmin",
            "groupId",
            "canDownload",
            "canSearch",
            "canUpload",
            "admin",
            "permissions",
            "search",
            "download",
            "upload",
            "registerUserButton"
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Verify Create Group form elements', async () => {
        await clickElementByText(driver, 'Create Group');

        // Verify and scroll to all components
        const elements = [
            "createGroupHeader",
            "groupName",  
            "groupNameInput",
            "createGroupButton" 
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Verify Assign Package form elements', async () => {
        await clickElementByText(driver, 'Assign Package to Group');

        // Verify and scroll to all components
        const elements = [
            "assignPackageHeader",
            "package",  
            "packageIdInput",
            "group",
            "groupIdInput",
            "assignPackageButton"
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Verify Get Groups form elements', async () => {
        await clickElementByText(driver, 'Get Groups');

        // Verify and scroll to all components
        const elements = [
            "getGroupsHeader",
            "successMessage"
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Verify Get Users form elements', async () => {
        await clickElementByText(driver, 'Get Group Users');

        // Verify and scroll to all components
        const elements = [
            "getUsersHeader",
            "group",  
            "groupIdInput",
            "getUsersButton" 
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });

    test('Verify Get Package History form elements', async () => {
        await clickElementByText(driver, 'Get Package History');

        // Verify and scroll to all components
        const elements = [
            "getPackageHistoryHeader",
            "package",  
            "packageIdInput",
            "getPackageHistoryButton" 
        ];

        for (const id of elements) {
            const el = await driver.wait(until.elementLocated(By.id(id)), 5000);
            await driver.executeScript("arguments[0].scrollIntoView(true);", el);
            expect(await el.isDisplayed()).toBe(true);
        }
    });
    
    //   test('Submit valid inputs and validate success message', async () => {
    //     const userIdInput = await driver.findElement(By.id('userIdInput'));
    //     const groupIdInput = await driver.findElement(By.id('groupIdInput'));
    //     const submitButton = await driver.findElement(By.id('submitButton'));
    
    //     await driver.executeScript('arguments[0].scrollIntoView(true);', userIdInput);
    //     await fillInputField(driver, By.id('userIdInput'), '35');
    
    //     await driver.executeScript('arguments[0].scrollIntoView(true);', groupIdInput);
    //     await fillInputField(driver, By.id('groupIdInput'), '6');
    
    //     await driver.executeScript('arguments[0].scrollIntoView(true);', submitButton);
    //     await driver.wait(until.elementIsVisible(submitButton), 5000);
    //     await driver.executeScript('arguments[0].click();', submitButton);
    
    //     await waitForElement(driver, By.id('successMessage'), 5000);
    //     const successMessage = await driver.findElement(By.id('successMessage'));
    //     await driver.executeScript('arguments[0].scrollIntoView(true);', successMessage);
    //     expect(await successMessage.getText()).toContain('User assigned to a new group');
    //   });
    
    //   test('Submit invalid inputs and validate error message', async () => {
        
    //     const userIdInput = await driver.findElement(By.id('userIdInput'));
    //     const groupIdInput = await driver.findElement(By.id('groupIdInput'));
    //     const submitButton = await driver.findElement(By.id('submitButton'));
    
    //     await driver.executeScript('arguments[0].scrollIntoView(true);', userIdInput);
    //     await fillInputField(driver, By.id('userIdInput'), '999');
    
    //     await driver.executeScript('arguments[0].scrollIntoView(true);', groupIdInput);
    //     await fillInputField(driver, By.id('groupIdInput'), '999');
    
    //     await driver.executeScript('arguments[0].scrollIntoView(true);', submitButton);
    //     await driver.wait(until.elementIsVisible(submitButton), 5000);
    //     await driver.executeScript('arguments[0].click();', submitButton);
    
    //     await waitForElement(driver, By.id('errorMessage'), 5000);
    //     const errorMessage = await driver.findElement(By.id('errorMessage'));
    //     await driver.executeScript('arguments[0].scrollIntoView(true);', errorMessage);
    //     expect(await errorMessage.getText()).toContain('Error 404:');
    //   });
    
    test('Verify components on "Get Tracks" page', async () => {
        // Click on the "Get Tracks" button
        await clickElementByText(driver, 'Back to Home');
        await clickElementByText(driver, 'Back to Landing Page');
        await clickElementByText(driver, 'Tracks');

        // Verify the "Planned Tracks" heading is displayed
        const plannedTracksHeading = await driver.wait(
            until.elementLocated(By.xpath("//h2[contains(text(), 'Planned Tracks')]")),
            5000
        );
        expect(await plannedTracksHeading.isDisplayed()).toBe(true);

        // Verify the "Access control track" item appears under the heading
        const accessControlTrack = await driver.wait(
            until.elementLocated(By.xpath("//li[contains(text(), 'Access control track')]")),
            5000
        );
        expect(await accessControlTrack.isDisplayed()).toBe(true);
    });
});

    
