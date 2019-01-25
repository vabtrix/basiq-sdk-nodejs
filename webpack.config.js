const path = require("path");
const PrettierPlugin = require("prettier-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  target: "node",
  mode: "none",
  plugins: [
    new PrettierPlugin({
      printWidth: 120,
      encoding: "utf-8",
      extensions: [".js"]
    })
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "library",
    libraryTarget: "umd"
  },
  externals: ["request", "ajv"],
  devtool: "sourcemap"
};
