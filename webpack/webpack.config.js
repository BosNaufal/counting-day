
var webpack = require('webpack');
require('es6-promise').polyfill();

module.exports = {

  entry: __dirname + '/../examples/index.js',

  devtool: 'cheap-module-eval-source-map',

  output: {
    path: __dirname + '/../build',
    publicPath: '/build/',
    filename: 'build.js',
    chunkFilename: '[name]-[hash].js'
  },

  devServer: {
    port: 8000,
    publicPath: '/build/',
    stats: "errors-only"
  },

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

  plugins: [
    new webpack.NamedModulesPlugin()
  ]

};
