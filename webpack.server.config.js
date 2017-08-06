const webpack = require( 'webpack' );
const FlowBabelWebpackPlugin = require( 'flow-babel-webpack-plugin' );

module.exports = {
   context: __dirname,
   name: 'server',
   entry: { server: './lib/server' },
   output: {
      filename: '[name].js',
      path: __dirname + '/dist',
      publicPath: 'dist/',
      libraryTarget: 'commonjs'
   },
   target: 'node',
   devtool: 'sourcemap',
   externals: [
      'express',
      'react',
      'react-dom/server',
      //'react-pdf/build/react-pdf'
   ],
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: __dirname + '/node_modules',
            use: [ 'babel-loader' ]
         },
         {
            test: /\.scss$/,
            use: [ 'css-loader/locals', 'sass-loader?precision=10' ],
         }
      ]
   },
   plugins: [
      new FlowBabelWebpackPlugin(),
      new webpack.DefinePlugin( {
         File: function File() { throw new Error( 'File() not implemented' ); },
         Blob: function Blob() { throw new Error( 'Blob() not implemented' ); }
      } ),
      new webpack.optimize.ModuleConcatenationPlugin()
   ]
};
