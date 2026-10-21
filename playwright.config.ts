import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,use:{baseURL:'http://localhost:3000',headless:true,launchOptions:process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}},webServer:{command:'npm run dev -- --port 3000',url:'http://localhost:3000',reuseExistingServer:true,timeout:60000}});
