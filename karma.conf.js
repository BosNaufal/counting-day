
var webpack = require('webpack');

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

    webpack: {

      devtool: 'cheap-module-eval-source-map',

      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
          },
          {
            test: /\.css$/,
            use: ['style-loader','css-loader']
          }
        ]
      },

      stats: "errors-only",

      // webpackMiddleware: {
      //    // webpack-dev-middleware configuration
      //    // i.e.
      //    noInfo: true,
      //    // and use stats to turn off verbose output
      //    stats: {
      //        // options i.e.
      //        chunks: false
      //    }
      // },
    },

    webpackServer: {
      noInfo: true,
    },

  })
};
