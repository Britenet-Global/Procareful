/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/procareful-admin',

  server: {
    port: 4201,
    host: 'localhost',
  },

  preview: {
    port: 4301,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), svgr({ include: '**/*.svg?react' })],
  build: {
    outDir: '../../dist/apps/procareful-admin',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/procareful-admin',
      provider: 'v8',
    },
  },
  resolve: {
    alias: [
      {
        find: '@ProcarefulAdmin',
        replacement: resolve(__dirname, './src/app'),
      },
      { find: '@ProcarefulAdminAssets', replacement: resolve(__dirname, './src/assets') },
      { find: '@Procareful/common', replacement: resolve('./libs/common/src') },
      { find: '@Procareful/ui', replacement: resolve('./libs/ui/src') },
      {
        find: '@ProcarefulAdmin/public',
        replacement: resolve(__dirname, './public'),
      },
    ],
  },
});
