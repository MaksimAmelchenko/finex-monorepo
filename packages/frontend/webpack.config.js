const { composePlugins, withNx } = require('@nrwl/webpack');
const { withReact } = require('@nrwl/react');
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;
const glob = require('glob');
const TerserJSPlugin = require('terser-webpack-plugin');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config, { options, context }) => {
  // Update the webpack config as needed here.
  // e.g. config.plugins.push(new MyPlugin())

  // https://github.com/nrwl/nx/issues/9717#issuecomment-1424044108
  config.resolve.mainFields = ['browser', 'module', 'main'];
  config.optimization.minimizer.unshift(new TerserJSPlugin());

  /* 
  config.plugins.push(
    new StatoscopeWebpackPlugin({
      saveReportTo: '.statoscope/report-[name]-[hash].html',
      saveStatsTo: '.statoscope/stats-[name]-[hash].json',
      disableReportCompression: false,
      statsOptions: {},
      additionalStats: glob.sync('.statoscope/*.json'),
      watchMode: true,
      name: 'cf',
      open: 'file',
      compressor: 'gzip',
    })
  );
 */

  return config;
});
