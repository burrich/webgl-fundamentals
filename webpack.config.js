const path              = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: "babel-loader" 
      },
      { 
        test: /\.css$/, 
        use: ['style-loader', 'css-loader'] 
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: './src/shaders', to: './'}])
  ]
};