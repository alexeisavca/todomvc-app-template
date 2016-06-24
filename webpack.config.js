var webpack = require('webpack');
var path = require('path');
module.exports = {
  entry: {
    main: "./index.jsx"
  },
  output: {
    filename: "./index.js"
  },
  module: {
    loaders: [
      { test: /\.(jsx|es6)$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6', '.jsx']
  },
  devtool: 'source-map'
};
