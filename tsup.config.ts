import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  dts: true,
  outDir: './lib',
  target: 'es2017',
  minify: true,
});
