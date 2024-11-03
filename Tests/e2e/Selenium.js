const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Navigate to your web page
        await driver.get('http://www.example.com');

        // Example: Find an element by its name and send a key
        await driver.findElement(By.name('q')).sendKeys('Selenium', Key.RETURN);

        // Example: Wait until the title contains 'Selenium'
        await driver.wait(until.titleContains('Selenium'), 1000);

        // Example: Get the title of the page and print it
        let title = await driver.getTitle();
        console.log(title);
    } finally {
        // Quit the driver
        await driver.quit();
    }
})();