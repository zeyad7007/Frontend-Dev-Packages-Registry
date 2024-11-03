import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as path from 'path';

export async function getChromeDriver() {
    // Define the path to ChromeDriver
    const chromeDriverPath = path.resolve(__dirname, '../../drivers/chromedriver'); 

    // Set up Chrome service with the driver path
    const chromeService = new chrome.ServiceBuilder(chromeDriverPath);

    // Create a new instance of the WebDriver for Chrome
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(chromeService)
        .build();

    return driver;
}
