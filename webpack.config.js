const CopyWebpackPlugin = require('copy-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const path = require('path')
const env = require('yargs').argv.env

//See for some more smart configurations: https://github.com/krasimir/webpack-library-starter

const plugins = [
  new CopyWebpackPlugin([{from: 'demo/static'}]),
]

const isBuild = env === 'build'
const outputInfix = isBuild ? '.min' : ''

if (isBuild) {
  //MinifyPlugin does not work with devtool:source-map. See below.
  plugins.push(new MinifyPlugin({},{}))
}

module.exports = {
  entry: {
  	['jmcharts'+outputInfix]: './src/index.js',
    ['demoNice'+outputInfix]: './demo/src/demoNice.js',
    ['demoAll'+outputInfix]: './demo/src/demoAll.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
      }
    ],
  },
  devtool: isBuild ? 'none' : 'source-map',
  devServer: {
    contentBase: './build'
  },
  plugins: plugins
}
