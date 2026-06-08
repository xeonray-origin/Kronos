import path from 'path';
import { fileURLToPath } from 'url';
import nodeExternals from 'webpack-node-externals';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default (_env, argv) => ({
  target: 'node',
  entry: './src/index.ts',
  mode: argv.mode ?? 'development',
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: [nodeExternals()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
});
