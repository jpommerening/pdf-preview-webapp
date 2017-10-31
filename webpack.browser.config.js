const webpack = require( 'webpack' );
const FlowBabelWebpackPlugin = require( 'flow-babel-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const StatsWriterPlugin = require( 'webpack-stats-plugin' ).StatsWriterPlugin;

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
            use: [ {
               loader: 'babel-loader',
               options: {
                  presets: [ [ 'env', {
                     browsers: [ 'latest 2 versions', '> 1%' ],
                     modules: false
                  } ] ],
                  plugins: [
                     'transform-class-properties',
                     'transform-object-rest-spread',
                     'transform-flow-comments',
                     'babel-plugin-transform-react-jsx',
                     'react-hot-loader/babel'
                  ]
               }
            } ]
         },
         {
            test: /\.s?css$/,
            use: ExtractTextPlugin.extract( {
               use: [ 'css-loader', 'sass-loader' ],
               fallback: [ 'style-loader' ],
               publicPath: ''
            } )
         },
         {
            test: /\.(gif|jpe?g|png|eot|svg|ttf|woff2?)(\?.*)?$/,
            use: [ 'file-loader?name=[hash:hex:20].[name].[ext]' ]
         },
         {
            test: /\.(eot|ttf|woff2?)(\?.*)?$/,
            use: [ 'icon-loader' ]
         },
      ]
   },
   plugins: [
      new webpack.DefinePlugin( {
         process: { env: {} }
      } ),
      new ExtractTextPlugin( 'style.css' ),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new FlowBabelWebpackPlugin(),
      new StatsWriterPlugin( {
         filename: 'stats.json',
         fields: [
            'publicPath',
            'assets'
         ]
      } )
   ]
};
