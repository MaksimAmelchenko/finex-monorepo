// const WebpackModules = require('webpack-modules');
const path = require('path');

module.exports = {
  stories: [
    //
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/**/stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    //
    '@storybook/addon-essentials',
    '@storybook/addon-postcss',
  ],
  babel: async options => ({
    ...options,
    presets: [['@babel/typescript', { jsxPragma: 'h' }]],
  }),

  webpackFinal: async (config, { configType }) => {
    config.module.rules = [
      ...config.module.rules.filter(rule => rule.test && !rule.test.toString().includes('.css')),
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
        ],
      },
    ];

    return config;
  },
};
