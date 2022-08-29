import * as webpack from 'webpack';
import * as path from 'path';
import 'webpack-dev-server';
import InspectWebpackPlugin from '../src/node';

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
      {
        test: /.less$/,
        use: [
          'style-loader', // 插入到 style 标签中
          'css-loader',
          'less-loader',
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  plugins: [
    new InspectWebpackPlugin(),
  ],
};

export default config;
