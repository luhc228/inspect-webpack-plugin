import { Compiler, NormalModule, Configuration, RuleSetRule, RuleSetUseItem } from 'webpack';
import type { TransformMap } from '../types';
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

  wrap(webpackConfig: Configuration) {
    if (this.options.disable) {
      return webpackConfig;
    }
    if (webpackConfig.module?.rules) {
      webpackConfig.module.rules = this.prependLoaders(webpackConfig.module.rules);
    }

    webpackConfig.plugins = (webpackConfig.plugins || []).concat(this);
    // TODO: add a middleware to devServer
    return webpackConfig;
  }

  apply(compiler: Compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      // TODO: optimize the log
      console.log(`Inspect server on localhost:8080/${devServerPath}`);
    });

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      const normalModuleLoader = NormalModule.getCompilationHooks(compilation).loader;
      normalModuleLoader.tap(PLUGIN_NAME, (loaderContext: Record<string, any>) => {
        loaderContext[PLUGIN_NAME] = this.recordTransformInfo;
      });

      compilation.hooks.buildModule.tap(PLUGIN_NAME, (module) => {
        // @ts-expect-error `resource` param doesn't exist in `Module` type, but it exists exactly.
        const { resource: id } = module;
        if (id && !this.options.exclude?.test(id)) {
          console.log('buildModule: ', id);
          if (!this.transformMap[id]) {
            // @ts-expect-error `resourceResolveData` param doesn't exist in `Module` type, but it exists exactly.
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

  recordTransformInfo(result: any) {
    console.log('recordTransformInfo', result);
  }

  private prependLoaders(rules: (RuleSetRule | '...')[]) {
    for (const rule of rules) {
      if (rule === '...') {
        continue;
      }
      if (rule.loader) {
        rule.use = [rule.loader];
        if (rule.options) {
          rule.use[0] = { loader: rule.loader, options: rule.options };
          delete rule.options;
        }
      }
      if (rule.use) {
        if (!Array.isArray(rule.use)) {
          rule.use = [rule.use] as any;
        }
        (rule.use as RuleSetUseItem[]).unshift(require.resolve('./loader'));
      }
      if (rule.oneOf) {
        rule.oneOf = this.prependLoaders(rule.oneOf) as RuleSetRule[];
      }
      // if (Array.isArray(rule.resource)) {
      //   rule.resource = this.prependLoaders(rule.resource);
      // }
      // if (rule.resource && rule.resource.and) {
      //   rule.resource.and = this.prependLoaders(rule.resource.and);
      // }
      // if (rule.resource && rule.resource.or) {
      //   rule.resource.or = this.prependLoaders(rule.resource.or);
      // }
    }
    return rules;
  }
}
