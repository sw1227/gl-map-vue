module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.frag$/i,
          use: 'raw-loader',
        },
        {
          test: /\.vert$/i,
          use: 'raw-loader',
        },
      ],
    },
  },
};