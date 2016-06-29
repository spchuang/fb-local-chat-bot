var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: __dirname + '/main.js',
  output: { path: __dirname, filename: 'dist/bundle.js' },
  devtool: 'source-map',
  debug: true,
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            "transform-flow-strip-types",
            "syntax-trailing-function-commas",
            "transform-class-properties"
          ],
        }
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new webpack.OldWatchingPlugin()
  ],
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
