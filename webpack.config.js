const path = require("path"),
    fs = require("fs"),
    webpack = require("webpack");

const nodeModules = {};

fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });


module.exports = {
    entry: './src/index.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'library',
        libraryTarget: 'umd'
    },
    externals: nodeModules,
    devtool: 'sourcemap'
};