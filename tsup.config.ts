import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  dts: true,
  outDir: './lib',
  target: 'es2017',
});
