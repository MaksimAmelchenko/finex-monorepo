const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PreactRefreshPlugin = require('@prefresh/webpack');

const devMode = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging';

const presets = () => [
  [
    '@babel/preset-env',
    {
      // debug: true,
      useBuiltIns: 'usage',
      corejs: 3,
      modules: false,
    },
  ],
  '@babel/typescript',
];

module.exports = (env, argv) => ({
  entry: ['./src/index.tsx'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/',
  },
  devtool: argv.local ? 'eval-source-map' : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.pug'],
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      // Must be below test-utils
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: presets(argv.local),
              plugins: [
                [
                  '@babel/plugin-transform-react-jsx',
                  {
                    pragma: 'h',
                    pragmaFrag: 'Fragment',
                  },
                ],
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
              ],
            },
          },
        ],
        exclude: /(node_modules)/,
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: presets(argv.local),
            },
          },
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.pug/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: presets(argv.local),
            },
          },
          {
            loader: 'pug-loader',
            options: {
              root: path.resolve(__dirname, 'src'),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
              modules: true,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
        exclude: /Icon\.svg$/,
      },
      {
        test: /Icon\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: {
                  removeViewBox: false,
                },
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: {
      index: '/index.html',
    },
    index: 'index.html',
    host: '0.0.0.0',
    hot: true,
  },

  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      h: ['preact', 'h'],
      Fragment: ['preact', 'Fragment'],
    }),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: devMode,
      'process.env.NODE_ENV': JSON.stringify(devMode ? 'development' : 'production'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        // {
        //   from: 'fonts/*{.woff,.woff2}',
        //   to: '',
        //   context: 'src',
        // },
        {
          from: '**/*.*',
          to: '',
          context: 'src/public',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html/index.pug',
      filename: `index.html`,
      templateParameters: () => ({
        local: argv.local,
      }),
    }),
    ...(devMode
      ? [new PreactRefreshPlugin()]
      : [
          new MiniCssExtractPlugin({
            filename: '[name]-[hash].css',
            chunkFilename: '[name]-[chunkhash].css',
          }),
        ]),
  ],
});
