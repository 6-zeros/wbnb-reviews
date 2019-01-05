const path = require('path');

module.exports = {
  mode: 'production',
  entry: './client/src/index.jsx',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    filename: 'reviews.js',
    path: path.resolve(__dirname, 'public/dist')
  }
};
