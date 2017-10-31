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
      'sockjs',
      'sockjs-client'
      //'react-pdf/build/react-pdf'
   ],
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: __dirname + '/node_modules',
            use: [ {
               loader: 'babel-loader',
               options: {
                  presets: [ [ 'env', {
                     node: '4.8',
                     modules: false
                  } ] ],
                  plugins: [
                     'transform-class-properties',
                     'transform-object-rest-spread',
                     'transform-flow-comments',
                     'babel-plugin-transform-react-jsx'
                  ]
               }
            } ]
         },
         {
            test: /\.s?css$/,
            use: [ 'css-loader/locals', 'sass-loader?precision=10' ],
         }
      ]
   },
   plugins: [
      new webpack.DefinePlugin( {
         File: function File() { throw new Error( 'File() not implemented' ); },
         Blob: function Blob() { throw new Error( 'Blob() not implemented' ); }
      } ),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new FlowBabelWebpackPlugin()
   ]
};
