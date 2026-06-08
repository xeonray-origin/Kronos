import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default (_env, argv) => ({
  entry: './src/main.tsx',
  mode: argv.mode ?? 'development',
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
});
