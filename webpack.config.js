const path = require("path")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const px2rem = require("postcss-px2rem")

module.exports = function (webpackEnv) {
  const isReact = webpackEnv !== "production"
  return {
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
    entry: isReact
      ? path.resolve(__dirname, "src/index.js")
      : {
        singleSpaEntry: path.resolve(__dirname, "src/singleSpaEntry.js"),
        // store: path.resolve(__dirname, "src/store.js"),
      },
    output: !isReact
      ? {
        filename: "[name].js",
        libraryTarget: "amd",
        library: "reactApp",
        publicPath: "/",
      }
      : {
        filename: "main.js",
        publicPath: "/",
      },
    module: {
      rules: [
        // {
        //   test: /\.(js|jsx|ts|tsx)$/,
        //   enforce: "pre",
        //   use: [
        //     {
        //       loader: "eslint-loader",
        //       options: {fix: true},
        //     },
        //   ],
        //   include: path.resolve(__dirname, "./src"),
        //   exclude: /node_modules/,
        // },
        {
          test: /\.less$/,
          use: [
            {
              loader: "style-loader", // creates style nodes from JS strings
            },
            {
              loader: "css-loader", // translates CSS into CommonJS
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: () => [
                  require("postcss-flexbugs-fixes"),
                  require("postcss-preset-env")({
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  }),
                  px2rem({remUnit: 37.5}),
                ],
              },
            },
            {
              loader: "less-loader", // compiles Less to CSS
            },
          ],
        },
        {
          test: /\.(js|jsx|ts|tsx)?$/,
          exclude: [path.resolve(__dirname, "node_modules")],
          use: {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: [
                require.resolve("@babel/preset-env"),
                require.resolve("@babel/preset-react"),
                require.resolve("@babel/preset-typescript"),
              ],
              plugins: [
                'transform-class-properties',
                ["@babel/plugin-proposal-decorators", {legacy: true}],
                require.resolve("@babel/plugin-transform-runtime")
              ],
              sourceType: "unambiguous",
            },
          },
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {},
            },
          ],
        },
      ],
    },
    plugins: isReact ? [
      new HtmlWebPackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "index.html"),
      }),
    ] : [],
    // devtool: "eval-source-map",
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      contentBase: path.resolve(__dirname, "dist"),
      historyApiFallback: true,
      proxy: {
        "/api": {
          target: "http://a.tangshui.net",
          pathRewrite: {"^/api": ""},
        },
        "/testapi": {
          target: "http://testenjoy.tangshui.net",
          pathRewrite: {"^/testapi": ""},
        },
        "/bookapi": {
          target: 'http://book.tripcity.cn/',
          pathRewrite: {"^/bookapi": ""},
        },
      },
      host: "0.0.0.0",
    },
  }
}
