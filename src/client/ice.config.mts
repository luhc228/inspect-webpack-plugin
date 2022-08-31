import { defineConfig } from '@ice/app';
import antd from '@ice/plugin-antd';

// see https://v3.ice.work/docs/guide/basic/config
export default defineConfig({
  plugins: [
    antd({
      importStyle: true,
      dark: true,
    }),
  ],
});
