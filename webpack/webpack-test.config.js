require('es6-promise').polyfill();

module.exports = {

  devtool: 'cheap-module-eval-source-map',

  stats: "errors-only",

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

};
