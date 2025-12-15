# Stagehand

基于[Playwright](https://playwright.dev/)实现的用自然语言实现前端自动化测试的工具。

## 🚀 什么是 Stagehand？

Stagehand 是一个基于 Playwright 的 AI 驱动的浏览器自动化框架，它允许开发者使用自然语言来控制浏览器操作，而无需编写复杂的选择器和脚本。

### 核心概念

#### 1. Act (执行操作)
使用自然语言描述来执行浏览器操作：

```typescript
// 点击按钮
await stagehand.act("Click the 'Evals' button.");

// 填写表单
await stagehand.act("Fill in the email input with user@example.com");

// 选择下拉菜单
await stagehand.act("Select 'United States' from the country dropdown");
```

#### 2. Observe (观察页面)
获取页面当前状态的描述：

```typescript
// 观察页面可交互元素
const observeResult = await stagehand.observe("What can I click on this page?");
console.log(observeResult);
// 返回: "The page contains several buttons: 'Home', 'About', 'Contact', and a search bar..."

// 观察特定区域
const headerInfo = await stagehand.observe("Describe the header section");
```

#### 3. Extract (提取信息)
从页面中提取结构化数据：

```typescript
// 提取价值主张
const valueProp = await stagehand.extract("Extract the value proposition from the page.");
console.log(valueProp);
// 返回: "Stagehand enables browser automation using natural language"

// 提取产品列表
const products = await stagehand.extract("Extract all product names and prices");
// 返回: [{ name: "Product A", price: "$29.99" }, ...]

// 提取表单数据
const formData = await stagehand.extract("Get all form field values");
```

#### 4. Agent (智能代理)
使用 AI 代理处理复杂任务：

```typescript
const agent = stagehand.agent({
  cua: true, // 启用计算机使用代理
  model: "google/gemini-2.5-computer-use-preview-10-2025",
  systemPrompt: "You're a helpful assistant that can control a web browser.",
});

// 执行复杂查询
const result = await agent.execute("What is the most accurate model to use in Stagehand?");
console.log(result);

// 执行多步骤任务
const taskResult = await agent.execute("Find the pricing page and tell me the cheapest plan");
```

## 🛠️ 安装

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 安装步骤

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，添加你的 API 密钥

# 3. 运行测试
npm run start

# 或者使用 Playwright UI 模式
npx playwright test ./src/test/stagehand.test.ts --ui
```

### 环境变量配置

在 `.env` 文件中配置以下 API 密钥：

```env
# Browserbase API (可选，用于云端浏览器)
BROWSERBASE_PROJECT_ID="YOUR_BROWSERBASE_PROJECT_ID"
BROWSERBASE_API_KEY="YOUR_BROWSERBASE_API_KEY"

# LLM API 密钥 (选择一个或多个)
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
GOOGLE_GENERATIVE_AI_API_KEY="YOUR_GOOGLE_GENERATIVE_AI_API_KEY"
ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY"
```

## 📚 Playwright 集成

### Playwright 基础概念

Playwright 是一个现代化的端到端测试框架，支持所有主流浏览器：

```typescript
import { test, expect } from '@playwright/test';

test('basic example', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

### Stagehand 与 Playwright 的集成

本项目提供了深度集成，允许同时使用 Stagehand 的自然语言能力和 Playwright 的精确控制：

```typescript
import { browserBase } from './../stagehand';

async function automatedTest() {
  const browserbase = await browserBase();
  const { stagehand, stagehandPage: page } = browserbase;
  
  // 使用 Stagehand 自然语言操作
  await page.goto("https://example.com");
  await stagehand.act("Click the login button");
  
  // 使用 Playwright 精确操作
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password123');
  
  // 再次使用 Stagehand
  await stagehand.act("Submit the form");
  
  // 验证结果
  const success = await stagehand.extract("Did the login succeed?");
  console.log(success);
}
```

### 配置选项

#### Stagehand 配置

```typescript
const stagehand = new Stagehand({
  env: 'LOCAL', // 或 'BROWSERBASE'
  model: 'gpt-4', // 选择 AI 模型
  verbose: 2, // 日志级别
  selfHeal: true, // 启用自愈功能
  cacheDir: 'stagehand-cache', // 缓存目录
});
```

#### Playwright 配置

在 `playwright.config.ts` 中配置测试环境：

```typescript
export default defineConfig({
  testDir: './src/test',
  fullyParallel: true,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Stagehand',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## 💡 使用示例

### 基础示例

```typescript
import { browserBase } from './stagehand';

async function basicExample() {
  const browserbase = await browserBase();
  const { stagehand, stagehandPage: page } = browserbase;
  
  // 导航到页面
  await page.goto("https://example.com");
  
  // 提取信息
  const title = await stagehand.extract("What is the main title of this page?");
  console.log("Page title:", title);
  
  // 执行操作
  await stagehand.act("Click on the first link");
  
  // 观察变化
  const observation = await stagehand.observe("What changed on the page?");
  console.log("Observation:", observation);
  
  await stagehand.close();
}
```

### 表单填写示例

```typescript
async function fillForm() {
  const browserbase = await browserBase();
  const { stagehand, stagehandPage: page } = browserbase;
  
  await page.goto("https://example.com/contact");
  
  // 使用自然语言填写表单
  await stagehand.act("Fill in the contact form with name 'John Doe', email 'john@example.com', and message 'Hello World'");
  await stagehand.act("Submit the form");
  
  // 验证提交结果
  const result = await stagehand.extract("Was the form submitted successfully?");
  return result;
}
```

### 数据抓取示例

```typescript
async function scrapeData() {
  const browserbase = await browserBase();
  const { stagehand, stagehandPage: page } = browserbase;
  
  await page.goto("https://example-shop.com/products");
  
  // 提取产品信息
  const products = await stagehand.extract(`
    Extract all products from this page and return them as an array of objects.
    Each object should have: name, price, description, and rating.
  `);
  
  console.log("Scraped products:", products);
  await stagehand.close();
  return products;
}
```

### 复杂任务自动化

```typescript
async function complexTask() {
  const browserbase = await browserBase();
  const { stagehand } = browserbase;
  
  // 使用 Agent 处理复杂任务
  const agent = stagehand.agent({
    cua: true,
    model: "gpt-4-vision-preview",
    systemPrompt: "You are an expert web automation assistant.",
  });
  
  const result = await agent.execute(`
    1. Go to the e-commerce site
    2. Search for wireless headphones
    3. Filter by price under $100
    4. Sort by customer rating
    5. Extract the top 3 products with their details
  `);
  
  console.log("Task result:", result);
  await stagehand.close();
}
```

## 🔧 高级功能

### 自定义系统提示

```typescript
const agent = stagehand.agent({
  systemPrompt: `
    You are a specialized e-commerce testing assistant.
    Focus on product details, pricing, and user experience.
    Always provide structured output with specific metrics.
  `,
});
```

### 错误处理和重试

```typescript
async function robustAutomation() {
  const browserbase = await browserBase({
    selfHeal: true,
    verbose: 2,
  });
  
  try {
    const { stagehand, stagehandPage: page } = browserbase;
    
    await page.goto("https://example.com");
    
    // 带重试的操作
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        await stagehand.act("Click the submit button");
        break; // 成功则退出循环
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        
        // 等待后重试
        await page.waitForTimeout(2000);
      }
    }
    
  } finally {
    await browserbase.close();
  }
}
```

### 并行执行

```typescript
import { Promise } from 'bluebird';

async function parallelTasks() {
  const urls = [
    'https://site1.com',
    'https://site2.com',
    'https://site3.com'
  ];
  
  const results = await Promise.map(urls, async (url) => {
    const browserbase = await browserBase();
    const { stagehand, stagehandPage: page } = browserbase;
    
    try {
      await page.goto(url);
      const title = await stagehand.extract("What is the page title?");
      return { url, title };
    } finally {
      await stagehand.close();
    }
  }, { concurrency: 3 });
  
  return results;
}
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npx playwright test ./src/test/stagehand.test.ts

# 使用 UI 模式
npx playwright test --ui

# 调试模式
npx playwright test --debug
```

### 测试报告

```bash
# 生成 HTML 报告
npx playwright test --reporter=html

# 查看报告
npx playwright show-report
```

## 📖 最佳实践

### 1. 环境配置
- 始终在 `.env` 文件中配置敏感信息
- 使用不同的环境变量文件用于开发和生产
- 定期更新 API 密钥

### 2. 错误处理
- 总是使用 try-catch 包装 Stagehand 操作
- 实现适当的重试机制
- 记录详细的错误信息用于调试

### 3. 性能优化
- 合理使用缓存减少 API 调用
- 并行执行独立的任务
- 及时关闭浏览器实例释放资源

### 4. 测试策略
- 结合使用 Stagehand 和 Playwright 操作
- 为关键流程编写自动化测试
- 使用数据驱动的方法进行批量测试

## 🚨 注意事项

1. **API 限制**: 注意 AI 模型的调用限制和费用
2. **网络稳定性**: 确保稳定的网络连接以避免中断
3. **页面变化**: 网站结构变化可能影响自动化脚本
4. **法律合规**: 遵守目标网站的使用条款和robots.txt

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License