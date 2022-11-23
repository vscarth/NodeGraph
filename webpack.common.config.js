/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const webpack = require("webpack");
const path = require("path");

module.exports = {
  experiments: {
    topLevelAwait: true,
  },
  entry: {
    index: path.join(__dirname, "./src/index.ts"),
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public"),
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js%/,
        use: {
          loader: "babel-loader",
        },
        exclude: /(node_modules)/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".jsx", ".vue", ".json"],
    alias: {
      "@": path.resolve("src"),
    },
  },
};
