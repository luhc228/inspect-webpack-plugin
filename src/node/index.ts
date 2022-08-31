import { Compiler, NormalModule, Configuration, RuleSetRule, RuleSetUseItem } from 'webpack';
import type { TransformMap, TransformInfo } from '../types';
import * as fs from 'fs';
import { PLUGIN_NAME } from './constants';

const devServerPath = '__inspect';

interface PluginOptions {
  /**
   * disable inspect-webpack-plugin or not
   */
  disable?: boolean;
  /**
   * exclusion for modules not to be inspected
   */
  exclude?: RegExp;
}

const DEFAULT_PLUGIN_OPTIONS: PluginOptions = {
  disable: false,
  exclude: /node_modules/,
};

export default class InspectWebpackPlugin {
  private options: PluginOptions = DEFAULT_PLUGIN_OPTIONS;
  private transformMap: TransformMap = {};

  constructor(options: PluginOptions = {}) {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  apply(compiler: Compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      console.log(this.transformMap);
      // TODO: optimize the log
      console.log(`Inspect server on localhost:8080/${devServerPath}`);
    });

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      const normalModuleLoader = NormalModule.getCompilationHooks(compilation).loader;
      normalModuleLoader.tap(PLUGIN_NAME, (loaderContext: Record<string, any>) => {
        loaderContext[PLUGIN_NAME] = this.recordTransformInfo;
      });

      compilation.hooks.buildModule.tap(PLUGIN_NAME, (module) => {
        // @ts-expect-error `resource` doesn't exist in `Module` type, but it exists exactly.
        const { resource: id } = module;
        if (id && !this.options.exclude?.test(id)) {
          // @ts-expect-error `loaders` doesn't exist in `Module` type, but it exists exactly.
          module.loaders.unshift(require.resolve('./loader'));

          if (!this.transformMap[id]) {
            // @ts-expect-error `resourceResolveData` doesn't exist in `Module` type, but it exists exactly.
            const code = fs.readFileSync(module.resourceResolveData.path, 'utf-8');
            const start = Date.now();
            this.transformMap[id] = [
              {
                name: '__LOAD__',
                result: code,
                start,
                end: start,
              },
            ];
          }
        }
      });
    });
  }

  recordTransformInfo = (result: TransformInfo & { id: string }) => {
    if (!result) {
      return;
    }
    const { id, ...transformInfo } = result;
    // Do not append the transform map if it existed.
    if (this.transformMap[id] && this.transformMap[id].slice(-1)[0]?.name === transformInfo.name) {
      return;
    }
    if (this.transformMap[id]) {
      this.transformMap[id].push({
        ...transformInfo,
      });
    }
  };
}
