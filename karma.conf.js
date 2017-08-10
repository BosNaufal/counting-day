
var webpack = require('webpack');
var webpackConfig = require('./webpack/webpack-test.config.js');

module.exports = function (config) {
  config.set({
    singleRun: false,

    frameworks: ['mocha'],

    files: [
      'webpack/webpack-test-context.config.js'
    ],

    preprocessors: {
      'webpack/webpack-test-context.config.js': ['webpack']
    },

    reporters: ['mocha'],

    port: 9000,

    webpack: webpackConfig,

    webpackServer: {
      noInfo: true,
    },

  })
};
