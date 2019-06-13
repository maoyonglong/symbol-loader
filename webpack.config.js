const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve('src/index'),
            options: {
              includes: [
                '*.js'
              ],
              symbols: {
                d: 'var d = 1'
              },
              template: `window.onload = function () {
                $_d
                $_source
              }`
            }
          }
        ]
      }
    ]
  }
}
