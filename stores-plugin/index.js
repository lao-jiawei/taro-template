"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");

function walkSync(srcDir, callback) {
  fs.readdirSync(srcDir, { withFileTypes: true }).forEach(function (dirent) {
    var filePath = path.join(srcDir, dirent.name);
    if (dirent.isFile()) {
      callback(filePath, dirent);
    }
    else if (dirent.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}
const TPL = `
//*******************************
//* 当前文件内容为自动生成，请勿修改 *
//*******************************

#imports#

class RootStore {
  constructor() {
#regs#
  }
}

export default new RootStore();
`;
function processStores(rootDir) {
  console.log('Processing stores...');
  const srcDir = path.resolve(rootDir, './src');
  const storeDir = path.resolve(srcDir, './stores');
  const stores = [];
  walkSync(srcDir, (filePath, dirent) => {
    const { name, ext } = path.parse(filePath);
    if (name.endsWith('Store') && (ext === '.js' || ext === '.ts')) {
      let relPath = path.relative(storeDir, filePath).replace(/\\/g, '/');
      if (!relPath.startsWith('.'))
        relPath = './' + relPath;
      stores.push({ name, relPath });
    }
  });
  const imports = stores.map((store) => `import ${store.name} from '${store.relPath}';`).join('\n');
  const regs = stores.map((store) => {
    const { name: clsName } = store;
    const name = clsName.replace(/^[A-Z]/, (match) => match.toLowerCase());
    return `    this.${name} = new ${clsName}(this);`;
  }).join('\n');
  fs.writeFileSync(path.resolve(storeDir, './index.js'), TPL.replace('#imports#', imports).replace('#regs#', regs));
}
/**
 * 编译过程扩展
 */
exports.default = (ctx, pluginOpts) => {
  ctx.onBuildStart(() => {
    // console.log('插件入参：', pluginOpts)
    // console.log('编译开始')
  });
  ctx.modifyWebpackChain(({ chain }) => {
    // console.log('这里可以修改webpack配置')
    // // 示例：利用webpackChain向html中插入脚本
    // if (process.env.TARO_ENV !== 'h5') return
    // chain
    //   .plugin('htmlWebpackPlugin')
    //   .tap(([pluginConfig]) => {
    //     return [
    //       {
    //         ...pluginConfig,
    //         script: pluginConfig.script + 'console.log("向html中插入代码");'
    //       }
    //     ]
    //   })
    processStores(ctx.paths.appPath);
  });
  ctx.onBuildComplete(() => {
    // console.log('Taro 构建完成！')
  });
  ctx.modifyBuildAssets(({ assets }) => {
    // console.log('修改编译后的结果')
    // // 示例：修改html产物内容
    // const indexHtml = assets['index.html']
    // if (indexHtml && indexHtml._value) {
    //   indexHtml._value = indexHtml._value.replace(/<title>(.*?)<\/title>/,'<title>被插件修改过的标题</title>')
    // }
  });
  ctx.onBuildFinish(() => {
    // console.log('Webpack 编译结束！')
  });
};
//# sourceMappingURL=index.js.map
