const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let config = {
  entry: {
    main: './src/main.ts',
    settings: './src/settings.ts',
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
    }),
    new HtmlWebpackPlugin({
      filename: 'settings.html',
      template: './src/settings.html',
    })
  ]
};

module.exports = (env, argv) => {
  if (env.minimal=='true') {
    console.log("Minimal build");
    delete config.entry.main;
    delete config.entry.settings;
    delete config.plugins.at(1);
  }
  return config;
};