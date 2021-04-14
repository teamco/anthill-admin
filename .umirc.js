import { defineConfig } from 'umi';
import { routes } from './routes';
import proxy from './proxy';

export default defineConfig({
  crossorigin: true,
  routes,
  proxy,
  dva: {
    immer: true,
    hmr: true,
  },
  lessLoader: {
    lessLoaderOptions: {},
  },
  nodeModulesTransform: {
    type: 'none',
  },
});
