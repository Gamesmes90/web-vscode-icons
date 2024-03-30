const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    GitHub: './src/GitHub.ts',
    GitLab: './src/GitLab.ts',
    Gitea: './src/Gitea.ts',
    SourceForge: './src/SourceForge.ts'
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin({
        patterns: [
            { from: 'utils' }
        ]
    })
  ]
}