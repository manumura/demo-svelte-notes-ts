import { defineConfig } from 'cypress';
import { devServer as viteDevServer } from '@cypress/vite-dev-server';
import path from 'path';

export default defineConfig({
  component: {
    devServer(config) {
      return viteDevServer({
        cypressConfig: config.cypressConfig,
        devServerEvents: config.devServerEvents,
        specs: config.specs,
        viteConfig: {
          configFile: path.resolve(__dirname, 'vite.config.ts'),
        },
        onConfigNotFound: (server, cwd, lookedIn) => {
          console.error('Config not found ', lookedIn);
        },
      });
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
