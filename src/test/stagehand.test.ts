import "dotenv/config";
import { test } from '@playwright/test';
import { browserBase } from "./../stagehand";

async function main() {
  try {
    test.setTimeout(5 * 60 * 1000);
    const browserbase = await browserBase();
    const { stagehand, stagehandPage: page } = browserbase;
  
    await page.goto("https://stagehand.dev");
  
    const extractResult = await stagehand.extract("Extract the value proposition from the page.");
    console.log(`Extract result:\n`, extractResult);
  
    await stagehand.act("Click the 'Evals' button.");
  
    const observeResult = await stagehand.observe("What can I click on this page?");
    console.log(`Observe result:\n`, observeResult);
  
    const agent = stagehand.agent({
      cua: true,
      model: "google/gemini-2.5-computer-use-preview-10-2025",
      systemPrompt: "You're a helpful assistant that can control a web browser.",
    });
  
    const agentResult = await agent.execute("What is the most accurate model to use in Stagehand?");
    console.log(`Agent result:\n`, agentResult);
  
    await stagehand.close();
    
  } catch (error) {
    console.error(error);
  }
}

test('stagehand test', main);