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
      new FlowBabelWebpackPlugin(),
      new ModuleConcatenationPlugin(),
      new SsrPlugin( __dirname + '/dist/server.js', {} )
   ],
   devServer: {
      setup: function( app, server ) {
         const plugin = module.exports.plugins[3];
         const fs = server.middleware.fileSystem;
         app.use( plugin.app( fs ) );
      }
   }
};

function SsrPlugin( filename, options ) {
   let app;

   return {
      apply: function( compiler ) {
         compiler.plugin( 'compile', invalid );
         compiler.plugin( 'invalid', invalid );
      },
      app: function( fs ) {
         const vm = require( 'vm' );
         const path = require( 'path' );
         require( 'source-map-support' ).install();
         return function( req, res, next ) {
            if( !app ) {
               const source = fs.readFileSync( filename );
               const exports = {};
               const module = { exports: exports };
               const sandbox = Object.assign( Object.create( global ), {
                  exports: exports,
                  require: require,
                  module: module,
                  __filename: filename,
                  dirname: path.dirname( filename )
               } );
               const script = new vm.Script( source, { filename: filename } );
               const context = vm.createContext( sandbox );

               script.runInContext( context );
               app = ( exports.default || module.exports )( options );
               console.log( 'update app' );
            }
            app( req, res, next );
         }
      }
   };

   function invalid() {
      app = null;
   }
}
