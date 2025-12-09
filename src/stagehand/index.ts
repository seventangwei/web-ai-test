import 'dotenv/config';
import path from 'path';
// import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { Stagehand } from '@browserbasehq/stagehand';
import type { V3Options, Page as StagehandPage, V3Env } from '@browserbasehq/stagehand';
import { chromium } from 'playwright-core';
import type { Page as PwPage, Browser } from 'playwright-core';

// const currentDir = dirname(fileURLToPath(import.meta.url));
const fileDir = path.join(__dirname, 'files');
const files: {path: string, ext: string}[] = [];
glob('**/*.*', { cwd: fileDir }).then((values) => {
  const filesGlob = values?.map((file) => ({
    path: file,
    ext: path.extname(file),
  }));
  if (filesGlob) files.push(...filesGlob);
}).catch((err) => {
  console.error(err);
})

class BrowserBaseClass {
  // stagehand实例
  public stagehand: Stagehand;
  // stagehand的Page实例
  public stagehandPage: StagehandPage;
  // playwright的Page实例
  public pwPage: PwPage;
  // 浏览器实例
  public browser: Browser;

  async init(config?: V3Options) {
    try {
      this.stagehand = new Stagehand({
        env: (process.env?.BROWSER_ENV as V3Env) || 'LOCAL',
        model: process.env?.AI_MODEL,
        verbose: 2, // 开启详细日志
        selfHeal: true,
        // cacheDir: 'stagehand-cache',
        ...(config || {}),
      });
      await this.stagehand.init();
      // 通过 CDP 连接到同一个浏览器实例
      const browser = await chromium.connectOverCDP({
        wsEndpoint: this.stagehand.connectURL(),
      });
      const [browserContext] = browser.contexts();
      const [page] = this.stagehand.context.pages();
      const [pwPage] = browserContext.pages();
      this.browser = browser;
      this.stagehandPage = page;
      this.pwPage = pwPage;
    } catch (error) {
      throw error;
    }
  }
  // multiple Playwright pages
  async newPage() {
    const [browserContext] = this.browser.contexts();
    const page = await browserContext.newPage();
    return page;
  }

  getInputToFile(ext?: string[]): string {
    if (!ext) {
      const [{ path }] = files;
      return `${fileDir}/${path}`;
    }
    const _ext = ext.map((ext) => (ext.includes('.') ? ext.toLowerCase() : `.${ext}`.toLowerCase()));
    const file = files.find((file) => _ext.includes(file.ext));
    if (file) return `${fileDir}/${file.path}`;
    return fileDir;
  }

  async close() {
    this.stagehand.close();
  }
}

export const browserBase = async (config?: V3Options) => {
  const instance = new BrowserBaseClass();
  await instance.init(config);
  return instance;
};
