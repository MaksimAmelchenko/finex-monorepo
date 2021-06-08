const webpack = require('webpack');

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

    // Add SVGR Loader
    const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));

    config.module.rules.unshift({
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
    });

    // Update svg rules from existing webpack rule
    config.module.rules = config.module.rules.filter(rule => rule !== assetRule);

    config.module.rules.push({
      ...assetRule,
      exclude: /Icon\.svg$/,
    });

    const tsxRule = config.module.rules.find(({ test }) => test.test('.tsx'));
    config.module.rules = config.module.rules.filter(rule => rule !== tsxRule);
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                  modules: false,
                },
              ],
              '@babel/typescript',
            ],
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
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        h: ['preact', 'h'],
        Fragment: ['preact', 'Fragment'],
      })
    );

    return config;
  },
};
