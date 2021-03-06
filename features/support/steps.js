const {
  Given,
  When,
  Then,
  BeforeAll,
  AfterAll,
  setDefaultTimeout,
} = require("cucumber");
const puppeteer = require("puppeteer");
const { should } = require("chai");

let page;
let browser;

setDefaultTimeout(50 * 1000);
should();

BeforeAll(async () => {
  browser = process.env.GITHUB_ACTIONS
    ? await puppeteer.launch()
    : await puppeteer.launch({ headless: false });

  page = await browser.newPage();
});

AfterAll(() => {
  if (!page.isClosed()) {
    browser.close();
  }
});

Given("Navigate to the sandbox", async () => {
  await page
    .goto("https://e2e-boilerplate.github.io/sandbox/", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});
});

When("I am on the sandbox page", async () => {
  await page.waitFor("h1");
  const title = await page.title();
  title.should.eql("Sandbox");
});

Then("The page header should be {string}", async (header) => {
  const title = await page.$eval("h1", (el) => el.textContent);
  title.should.eql(header);
});
