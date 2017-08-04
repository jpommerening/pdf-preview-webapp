const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const FlowBabelWebpackPlugin = require( 'flow-babel-webpack-plugin' );
const ModuleConcatenationPlugin = require( 'webpack' ).optimize.ModuleConcatenationPlugin;

module.exports = {
   context: __dirname,
   entry: { browser: './lib/browser' },
   output: {
      filename: '[name].js',
      path: __dirname + '/dist',
      publicPath: 'dist/'
   },
   devtool: 'sourcemap',
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
               use: [ 'css-loader', 'sass-loader' ],
               fallback: [ 'style-loader' ]
            })
         }
      ]
   },
   plugins: [
      new ExtractTextPlugin( 'style.css' ),
      new FlowBabelWebpackPlugin(),
      new ModuleConcatenationPlugin(),
      //new SsrPlugin( __dirname + '/dist/server.js', {} )
   ],
   devServer: {
      setup: function( app, server ) {
         //const plugin = module.exports.plugins[3];
         //const fs = server.middleware.fileSystem;
         //console.log( fs );
         //app.use( plugin.app( fs ) );
         app.use( require( './server' )() );
      }
   }
};

function SsrPlugin( path, options ) {
   let app;

   return {
      apply: function( compiler ) {
         compiler.plugin( 'compile', invalid );
         compiler.plugin( 'invalid', invalid );
      },
      app: function( fs ) {
         return function( req, res, next ) {
            if( !app ) {
               const source = fs.readFileSync( path );
               const exports = {};
               const module = { exports: exports };
               const fn = new Function( 'self', 'this', 'require', 'module', 'exports', 'File', 'Blob', source );
               fn( undefined, undefined, require, module, exports, notImplemented, notImplemented );
               app = module.exports.default || module.exports;
            }
            app( req, res, next );
         }
      }
   };

   function invalid() {
      app = null;
   }

   function notImplemented() {
      throw new Error( 'Function not implemented' );
   }
}
