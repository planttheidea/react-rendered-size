'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: '#source-map',

  entry: [path.resolve(__dirname, 'src', 'index.js')],

  externals: ['react', 'react-dom'],

  mode: 'development',

  module: {
    rules: [
      {
        enforce: 'pre',
        include: [path.resolve(__dirname, 'src')],
        loader: 'eslint-loader',
        options: {
          configFile: '.eslintrc',
          emitError: true,
          failOnError: true,
          failOnWarning: true,
          formatter: require('eslint-friendly-formatter'),
        },
        test: /\.js$/
      },
      {
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'DEV_ONLY')],
        test: /\.js$/,
        loader: 'babel-loader',
      }
    ]
  },

  output: {
    filename: 'react-rendered-size.js',
    library: 'getRenderedSize',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    umdNamedDefine: true,
  },

  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],

  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
  }
};
