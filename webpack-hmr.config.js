const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const path = require('path');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: [
      'webpack/hot/poll?1000', // Thay đổi khoảng thời gian polling nếu cần
      options.entry
    ],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?1000'], // Phải khớp với thời gian polling
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({ 
        name: options.output.filename,
        autoRestart: true 
      }),
    ],
    resolve: {
      extensions: ['.js', '.ts', '.json'], // Đảm bảo các loại file cần thiết được xử lý
    },
    output: {
      path: path.resolve(__dirname, 'dist'), // Thay đổi theo cấu trúc dự án của bạn
      filename: '[name].js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
      ],
    },
  };
};
