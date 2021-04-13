import { defineConfig } from 'umi';
import { routes } from './routes';

export default defineConfig({
  crossorigin: true,
  routes,
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
