
var webpack = require('webpack');
require('es6-promise').polyfill();
const isMinify = process.argv.indexOf('-p') !== -1

var npm = require("../package.json");

module.exports = {

  entry: __dirname + '/../src/index.js',

  output: {
    path: __dirname + '/../dist/',
    publicPath: '../dist/',
    filename: npm.name + (isMinify ? '.min' : '') + '.js',
    libraryTarget: "umd",
    library: "CountingDay"
  },

  externals: {
    // "vue": "Vue"
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

    new webpack.BannerPlugin((
      [
        "Copyright (c) Naufal Rabbani (http://github.com/BosNaufal)",
        "\n",
        "Licensed Under MIT (http://opensource.org/licenses/MIT)",
        "\n",
        "\n",
        "CountingDay @ Version "+ npm.version,
        "\n"
      ])
      .join("")),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),

  ]

};
