import { Compiler, NormalModule } from 'webpack';
import type { TransformMap, TransformInfo } from './types';
import fse from 'fs-extra';
import * as path from 'path';
import { PLUGIN_NAME, PORT, SERVER_HOST } from './constants';
import express from 'express';
import type { Request, Response } from 'express';

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
  private context = '';
  private done = false;

  constructor(options: PluginOptions = {}) {
    this.options = {
      ...this.options,
      ...options,
    };
  }

  apply(compiler: Compiler) {
    if (this.options.disable) {
      return;
    }

    this.context = compiler.context;

    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      this.done = true;
      this.createServer();
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
            const code = fse.readFileSync(module.resourceResolveData.path, 'utf-8');
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

  private createServer() {
    const app = express();

    app.use(express.static(path.join(__dirname, '../client')));

    app.get('/data', (req: Request, res: Response) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send({
        done: this.done,
        transformMap: this.transformMap,
        context: this.context,
      });
    });

    app.listen(PORT, () => {
      console.log(`Inspect server on ${SERVER_HOST}/`);
    });
  }
}
