const path = require("path"),
    webpack = require("webpack");

module.exports = {
    entry: "./index.js",
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.min.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
};