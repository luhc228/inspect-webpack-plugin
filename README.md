# inspect-webpack-plugin

[![NPM version](https://img.shields.io/npm/v/inspect-webpack-plugin.svg?style=flat)](https://npmjs.org/package/inspect-webpack-plugin)

A webpack plugin for inspecting module transform of loaders. The plugin is inspired by [vite-plugin-inspect](https://www.npmjs.com/package/vite-plugin-inspect).

![image](https://user-images.githubusercontent.com/44047106/187964296-9fe5bd85-e00b-4352-a62c-900684ba0b1f.png)

## Install

> Note: Webpack v5 is required.

```bash
npm i inspect-webpack-plugin -D
```

Add plugin to your `webpack.config.js`:

```ts
// vite.config.ts
import InspectWebpackPlugin from 'inspect-webpack-plugin';

export default {
  plugins: [
    new InspectWebpackPlugin(),
  ],
}
```

Then visit [localhost:9000/](http://localhost:9000/) to inspect the modules transform.
