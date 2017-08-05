const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const ModuleConcatenationPlugin = require( 'webpack' ).optimize.ModuleConcatenationPlugin;

module.exports = {
   context: __dirname,
   name: 'browser',
   entry: { browser: './lib/browser' },
   output: {
      filename: '[name].js',
      path: __dirname + '/dist',
      publicPath: 'dist/'
   },
   devtool: 'sourcemap',
   module: {
      noParse: /\/pdfjs-dist\/build\/pdf\.js$/,
      rules: [
         {
            test: /\.js$/,
            exclude: __dirname + '/node_modules',
            use: [ 'babel-loader' ]
         },
         {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
               use: [ 'css-loader', 'sass-loader' ],
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
