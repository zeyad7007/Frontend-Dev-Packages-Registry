import { Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as path from 'path';

export async function getChromeDriver() {
    const chromeDriverPath = path.resolve(__dirname, '../../drivers/chromedriver'); 

    const chromeService = new chrome.ServiceBuilder(chromeDriverPath);

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(chromeService)
        .build();

    return driver;
}
