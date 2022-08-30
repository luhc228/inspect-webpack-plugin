import * as path from 'path';
import { PLUGIN_NAME } from './constants';
import findUp from 'find-up';
import fse from 'fs-extra';

function getLoaderName(loaderPath: string) {
  const packageJsonPath = findUp.sync('package.json', { cwd: path.dirname(loaderPath) });
  if (packageJsonPath) {
    const pkg = fse.readJSONSync(packageJsonPath);
    return pkg.name;
  }
  return '';
}

export function pitch() {
  // @ts-expect-error this type
  const callback = this[PLUGIN_NAME];
  // @ts-expect-error this type
  const loaderPaths = this.loaders
    .map((loader: any) => loader.path)
    .filter((loader: any) => !loader.includes('speed-measure-webpack-plugin'));

  hijackLoaders(loaderPaths, (loader: any, path: string) => {
    const loaderName = getLoaderName(path);
    const wrapFunc = (func: any) => async function (...args: any[]) {
      const start = Date.now();
      // @ts-expect-error this type
      const almostThis = Object.assign({}, this, {
        async: function (...asyncArgs: any[]) {
          // @ts-expect-error this type
          const asyncCallback = this.async.apply(this, asyncArgs);
          // @ts-expect-error this type
          const { resource } = this;
          return function (...args: any[]) {
            const end = Date.now();
            const [, source] = args;
            callback({
              id: resource,
              name: loaderName,
              result: source,
              start,
              end,
            });
            // @ts-expect-error this type
            return asyncCallback.apply(this, args);
          };
          // @ts-expect-error this type
        }.bind(this),
      });
      const ret = func.apply(almostThis, args);
      return ret;
    };

    if (loader.normal) loader.normal = wrapFunc(loader.normal);
    if (loader.default) loader.default = wrapFunc(loader.default);
    if (loader.pitch) loader.pitch = wrapFunc(loader.pitch);
    if (typeof loader === 'function') return wrapFunc(loader);
    return loader;
  });
}

export function hijackLoaders(loaderPaths: string[], callback: any) {
  const wrapReq = (reqMethod: any) => {
    return function (...args: any[]) {
      // @ts-expect-error this type
      const ret = reqMethod.apply(this, args);
      if (loaderPaths.includes(args[0])) {
        if (ret.__inspectHijacked) return ret;
        ret.__inspectHijacked = true;
        return callback(ret, args[0]);
      }
      return ret;
    };
  };

  const Module = require('module');
  Module.prototype.require = wrapReq(Module.prototype.require);
}
