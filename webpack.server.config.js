const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const ModuleConcatenationPlugin = require( 'webpack' ).optimize.ModuleConcatenationPlugin;

module.exports = {
   context: __dirname,
   entry: { server: './lib/server' },
   output: {
      filename: '[name].js',
      path: __dirname + '/dist',
      publicPath: 'dist/',
      libraryTarget: 'commonjs'
   },
   target: 'node',
   externals: [
      'react',
      'react-dom',
      'react-pdf'
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
            use: ExtractTextPlugin.extract({
               use: [ 'css-loader', 'sass-loader?precision=10' ],
               fallback: [ 'style-loader' ]
            })
         }
      ]
   },
   plugins: [
      new ExtractTextPlugin( 'style.css' ),
      new ModuleConcatenationPlugin()
   ]
};
