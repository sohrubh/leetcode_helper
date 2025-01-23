const puppeteer = require('puppeteer');

async function scrapeLeetCodeTestCases(url) {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // browser user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0');

    // stoppinng load of unnecessary things (images, css)
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            request.abort();
        } else {
            request.continue();
        }
    });

    try {
        // Navigates to the page and wait for DOM content to load
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for either .elfjS, .example-block, or pre tags to appear
        await page.waitForSelector('.elfjS, .example-block, pre', { timeout: 10000 });

        const testCases = await page.evaluate(() => {
            const testCases = [];

            // Function to extract input and output from a text block
            const extractTestCase = (text) => {
                const parts = text.split('Output:');
                if (parts.length < 2) return null;

                const inputPart = parts[0].replace('Input:', '').trim();
                const outputPart = parts[1].split('Explanation:')[0].trim(); // Exclude explanation

                // Remove variable names and quotes
                const cleanInput = inputPart.replace(/[a-zA-Z]+ = /g, '').replace(/"/g, '');
                const cleanOutput = outputPart.replace(/"/g, '');

                return { input: cleanInput, output: cleanOutput };
            };

            // Handle test cases inside <pre> tags (older problems)
            const preElements = document.querySelectorAll('.elfjS pre, pre');
            preElements.forEach((pre) => {
                const testCase = extractTestCase(pre.textContent.trim());
                if (testCase) testCases.push(testCase);
            });

            // Handle test cases inside <span class="example-io"> (newer problems)
            const exampleBlocks = document.querySelectorAll('.example-block');
            exampleBlocks.forEach((block) => {
                const inputSpan = block.querySelector('span.example-io');
                const outputSpan = block.querySelectorAll('span.example-io')[1];

                if (inputSpan && outputSpan) {
                    const input = inputSpan.textContent.trim().replace(/[a-zA-Z]+ = /g, '').replace(/"/g, '');
                    const output = outputSpan.textContent.trim().replace(/"/g, '');
                    testCases.push({ input, output });
                }
            });

            return testCases;
        });

        await browser.close();
        return testCases;
    } catch (error) {
        console.error('Error during scraping:', error);
        await browser.close();
        return [];
    }
}

module.exports = { scrapeLeetCodeTestCases };