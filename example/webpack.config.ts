import * as webpack from 'webpack';
import * as path from 'path';
import 'webpack-dev-server';

const config: webpack.Configuration = {
  entry: path.resolve(__dirname, './src/App.tsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '...'],
  },
  cache: {
    type: 'filesystem',
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
          },
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
};

export default config;
