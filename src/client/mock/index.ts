export default {
  'GET /data': {
    done: true,
    transformMap: {
      '/Users/luhc228/workspace/github.com/luhc228/inspect-webpack-plugin/example/src/App.tsx': [
        {
          name: '__LOAD__',
          result: "import * as ReactDOM from 'react-dom/client';\nimport Home from './Home';\n\nconst root = ReactDOM.createRoot(\n  document.getElementById('root')!,\n);\n\nroot.render(\n  <Home />,\n);\n",
          start: 1661958156222,
          end: 1661958156222,
        },
        {
          name: 'swc-loader',
          result: 'import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";\nimport * as ReactDOM from "react-dom/client";\nimport Home from "./Home";\nvar root = ReactDOM.createRoot(document.getElementById("root"));\nroot.render(/*#__PURE__*/ _jsxDEV(Home, {}, void 0, false, {\n    fileName: "/Users/luhc228/workspace/github.com/luhc228/inspect-webpack-plugin/example/src/App.tsx",\n    lineNumber: 9,\n    columnNumber: 3\n}, this));\n',
          start: 1661958162806,
          end: 1661958162816,
        },
      ],
      '/Users/luhc228/workspace/github.com/luhc228/inspect-webpack-plugin/example/src/Home.tsx': [
        {
          name: '__LOAD__',
          result: "import './index.less';\n\nexport default function Home() {\n  return (\n    <div className=\"main\">Home</div>\n  );\n}\n",
          start: 1661958162855,
          end: 1661958162855,
        },
        {
          name: 'swc-loader',
          result: 'import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";\nimport "./index.less";\nexport default function Home() {\n    return /*#__PURE__*/ _jsxDEV("div", {\n        className: "main",\n        children: "Home"\n    }, void 0, false, {\n        fileName: "/Users/luhc228/workspace/github.com/luhc228/inspect-webpack-plugin/example/src/Home.tsx",\n        lineNumber: 5,\n        columnNumber: 5\n    }, this);\n};\n',
          start: 1661958162865,
          end: 1661958162867,
        },
      ],
      '/Users/luhc228/workspace/github.com/luhc228/inspect-webpack-plugin/example/src/index.less': [
        {
          name: '__LOAD__',
          result: '.main {\n  color: red;\n}',
          start: 1661958162953,
          end: 1661958162953,
        },
        {
          name: 'less-loader',
          result: '.main {\n  color: red;\n}\n',
          start: 1661958163261,
          end: 1661958163375,
        },
        {
          name: 'css-loader',
          result: '// Imports\nimport ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../../node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/noSourceMaps.js";\nimport ___CSS_LOADER_API_IMPORT___ from "../../node_modules/.pnpm/css-loader@6.7.1_webpack@5.74.0/node_modules/css-loader/dist/runtime/api.js";\nvar ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, ".main {\\n  color: red;\\n}\\n", ""]);\n// Exports\nexport default ___CSS_LOADER_EXPORT___;\n',
          start: 1661958163375,
          end: 1661958163387,
        },
        {
          name: 'mini-css-extract-plugin',
          result: '// extracted by mini-css-extract-plugin\nexport {};\n    if(module.hot) {\n      // 1661958163602\n      var cssReload = require("../../node_modules/.pnpm/mini-css-extract-plugin@2.6.1_webpack@5.74.0/node_modules/mini-css-extract-plugin/dist/hmr/hotModuleReplacement.js")(module.id, {"locals":false});\n      module.hot.dispose(cssReload);\n      module.hot.accept(undefined, cssReload);\n    }\n  ',
          start: 1661958162956,
          end: 1661958163602,
        },
      ],
    },
    context: '/Users/luhc228/workspace/github.com/luhc228/inspect-webpack-plugin',
  },
};