const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const rootDir = process.cwd();

module.exports = {
  entry: path.resolve(rootDir, 'src/index.js'),
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'bundle.[contenthash:8].js',
    assetModuleFilename: 'images/[name][hash:6][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: 'babel-loader',
        include: path.resolve(rootDir, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.(le|s[ac]|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer']
              }
            }
          },
          'postcss-loader',
          'less-loader',
          'sass-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        type: 'asset', // 根据文件大小自动选择resource/inline，默认判断界限为8kb，可通过Rule.parser.dataUrlCondition.maxSize修改
        // generator: {
        //   filename: '[name].[hash:6][ext]'
        // },
        // parser: {
        //   dataUrlCondition: {
        //     maxSize: 4 * 1024 // 4kb
        //   }
        // }
      },
      {
        test: /\.(htm|html)$/,
        loader: 'html-withimg-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'src/index.html'),
      inject: 'body',
      scriptLoading: 'blocking',
    }),
    new CleanWebpackPlugin(),
    new OptimizeCssPlugin(),
    new CopyWebpackPlugin({ // 静态资源复制到dist目录
      patterns: [
        {
          from: '*.js',
          context: path.resolve(rootDir, 'public/js'),
          to: path.resolve(rootDir, 'dist/js')
        }
      ]
    })
  ].concat(devMode ? [] : [new MiniCssExtractPlugin({ filename: 'css/[name].[hash:8].css' })]),
}