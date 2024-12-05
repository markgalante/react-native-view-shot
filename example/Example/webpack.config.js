// example/Example/webpack.config.js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const environment = process.env.NODE_ENV ?? "development";

const babelLoaderConfiguration = {
  test: /\.m?js$/,
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets: ["module:metro-react-native-babel-preset"],
      plugins: ["react-native-web"],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: "url-loader",
    options: {
      name: "[name].[ext]",
      esModule: false,
    },
  },
};

const fileLoaderConfiguration = {
  test: /\.(mp4)$/,
  use: {
    loader: "file-loader",
    options: {
      name: "[name].[ext]",
    },
  },
};

const tsLoaderConfiguration = {
  test: /\.tsx?$/,
  use: "ts-loader",
  exclude: /node_modules/,
};

module.exports = {
  mode: environment,
  entry: [path.resolve(__dirname, "index.web.js")],
  output: {
    filename: "bundle.web.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      fileLoaderConfiguration,
      tsLoaderConfiguration,
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new webpack.DefinePlugin({
      __DEV__: environment === "development",
    }),
  ],
  resolve: {
    alias: {
      "react-native$": "react-native-web",
    },
    extensions: [".web.js", ".js", ".ts", ".tsx"],
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
  },
  devServer: {
    compress: true,
    port: 9001,
    hot: true,
  },
};
