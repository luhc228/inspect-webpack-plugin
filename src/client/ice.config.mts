import { defineConfig } from '@ice/app';
import antd from '@ice/plugin-antd';

// see https://v3.ice.work/docs/guide/basic/config
export default defineConfig({
  outputDir: '../../build/client',
  plugins: [
    antd({
      importStyle: true,
      dark: true,
    }),
  ],
  server: {
    bundle: true,
    format: 'cjs',
  },
  webpack: (webpackConfig) => {
    if (process.env.NODE_ENV === 'development') {
      webpackConfig.devServer = webpackConfig.devServer || {};
      webpackConfig.devServer.devMiddleware = webpackConfig.devServer?.devMiddleware || {};
      webpackConfig.devServer.devMiddleware.writeToDisk = true;
    }
    return webpackConfig;
  },
});
