/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['**/*.{png}', '**/**/*.{png}'],
  manifest: {
    name: 'Procareful App',
    short_name: 'ProcarefulSA',
    description:
      'Pocareful project aims to address existing gaps in home care accessibility and timely delivery by upscaling existing social care services and targeting the potential for preventing cognitive and physical decline.',
    background_color: '#fff',
    start_url: '.',
    display: 'standalone',
    orientation: 'portrait',
    icons: [
      {
        src: 'images/procareful-logo16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: 'images/procareful-logo32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: 'images/procareful-logo64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      {
        src: 'images/procareful-logo180.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default defineConfig({
  base: '/',
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/procareful',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    svgr({ include: ['**/*.svg?react', '**/*.svg', '**/**/.svg'] }),
    VitePWA(manifestForPlugin),
  ],
  build: {
    outDir: '../../dist/apps/procareful',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    manifest: true,
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
      reportsDirectory: '../../coverage/apps/procareful',
      provider: 'v8',
    },
  },
  resolve: {
    alias: [
      {
        find: '@ProcarefulApp',
        replacement: resolve(__dirname, './src/app/'),
      },
      {
        find: '@ProcarefulAppAssets',
        replacement: resolve(__dirname, './src/assets'),
      },
      { find: '@Procareful/assets', replacement: resolve('./libs/ui/src/assets') },
      { find: '@Procareful/common', replacement: resolve('./libs/common/src') },
      { find: '@Procareful/ui', replacement: resolve('./libs/ui/src') },
      { find: '@Procareful/games', replacement: resolve('./libs/games/src') },
    ],
  },
});
