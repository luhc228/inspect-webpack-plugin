import type { Compiler } from 'webpack';
import type { TransformMap } from '../types';
import * as fs from 'fs';

const PLUGIN_NAME = 'inspect-webpack-plugin';

interface PluginOptions {
  /**
   * exclusion for modules not to be inspected
   */
  exclude?: RegExp;
}

const DEFAULT_PLUGIN_OPTIONS = {
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
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      // compilation.hooks.moduleIds.tap(PLUGIN_NAME, (modules) => {
      //   for (const module of modules) {
      //     // @ts-expect-error `resource` param doesn't exist in `Module` type, but it exists exactly.
      //     const { resource } = module;
      //     if (!this.options.exclude?.test(resource)) {
      //       console.log(resource);
      //     }
      //   }
      // });
      compilation.hooks.succeedModule.tap(PLUGIN_NAME, (module) => {
        // @ts-expect-error `resource` param doesn't exist in `Module` type, but it exists exactly.
        const { resource: id } = module;
        if (id && !this.options.exclude?.test(id)) {
          console.log(id);
          if (!this.transformMap[id]) {
            // @ts-expect-error `resourceResolveData` param doesn't exist in `Module` type, but it exists exactly.
            const code = fs.readFileSync(module.resourceResolveData.path, 'utf-8');
            this.transformMap[id] = [
              {
                name: '__LOAD__',
                result: code,
              },
            ];
          }
          // TODO:
          this.transformMap[id].push({
            name: '',
            result: '',
          });
        }
      });
    });
  }
}
