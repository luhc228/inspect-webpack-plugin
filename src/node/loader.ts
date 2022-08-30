import { PLUGIN_NAME } from './constants';

let id = 0;

const getLoaderName = (path: string) => {
  const standardPath = path.replace(/\\/g, '/');
  const nodeModuleName = /\/node_modules\/([^\/]+)/.exec(standardPath);
  return (nodeModuleName && nodeModuleName[1]) || '';
};

export function pitch() {
  // @ts-expect-error this type
  const callback = this[PLUGIN_NAME];
  // @ts-expect-error this type
  const module = this.resourcePath;
  // @ts-expect-error this type
  const loaderPaths = this.loaders
    .map((loader: any) => loader.path)
    .filter((loader: any) => !loader.includes('speed-measure-webpack-plugin'));

  hijackLoaders(loaderPaths, (loader: any, path: string) => {
    const loaderName = getLoaderName(path);
    const wrapFunc = (func: any) =>
      function () {
        const loaderId = id++;
        // @ts-expect-error this type
        const almostThis = Object.assign({}, this, {
          async: function () {
            // @ts-expect-error this type
            const asyncCallback = this.async.apply(this, arguments);

            return function () {
              callback({
                id: loaderId,
                type: 'end',
              });
              // @ts-expect-error this type
              return asyncCallback.apply(this, arguments);
            };
            // @ts-expect-error this type
          }.bind(this),
        });

        callback({
          module,
          loaderName,
          id: loaderId,
          type: 'start',
        });
        const ret = func.apply(almostThis, arguments);
        callback({
          id: loaderId,
          type: 'end',
        });
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
    return function () {
      // @ts-expect-error this type
      const ret = reqMethod.apply(this, arguments);
      if (loaderPaths.includes(arguments[0])) {
        if (ret.__inspectHijacked) return ret;
        ret.__inspectHijacked = true;
        return callback(ret, arguments[0]);
      }
      return ret;
    };
  };

  const Module = require('module');
  Module.prototype.require = wrapReq(Module.prototype.require);
}
