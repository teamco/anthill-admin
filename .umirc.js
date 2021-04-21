import { defineConfig } from 'umi';
import { routes } from './routes';
import proxy from './proxy';

const fs = require('fs');

/**
 * @function
 * @param dir
 * @param files_
 * @return {*[]}
 */
function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (let i in files) {
    const name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.match(/.model/)) {
        files_.push(name);
      }
    }
  }
  return files_;
}

const widgetsPath = `${__dirname}/src/vendors/widgets`;
const extraModels = getFiles(widgetsPath);

export default defineConfig({
  crossorigin: true,
  routes,
  proxy,
  dva: {
    extraModels,
    immer: true,
    hmr: true
  },
  lessLoader: {
    lessLoaderOptions: {}
  },
  nodeModulesTransform: {
    type: 'none'
  }
});
