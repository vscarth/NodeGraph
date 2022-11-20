/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  experiments: {
    topLevelAwait: true,
  },
  entry: path.join(__dirname, "./src/index.ts"),
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
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
