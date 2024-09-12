const path = require('path');

module.exports = {
  // Entry point for the application
  entry: './src/index.js',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Resolve configuration for polyfills
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      // Add other polyfills here if needed
    },
  },

  // Other configuration (e.g., loaders, plugins) goes here...
};

