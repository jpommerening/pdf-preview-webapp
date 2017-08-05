const path = require( 'path' );
const express = require( 'express' );
const app = express();
const publicPath = '/dist/';

if( process.env.NODE_ENV !== 'production' ) {
   const vm = require( 'vm' );
   const config = require( './webpack.config' );
   const dev = require( 'webpack-dev-middleware' );
   const webpack = require( 'webpack' );
   const compiler = webpack( config );
   const middleware = dev( compiler, {
      stats: {
         colors: true,
      },
      publicPath: publicPath,
      serverSideRender: true
   } );
   const cache = {
   };

   app.use( middleware );
   app.use( ( req, res, next ) => {
      const stats = res.locals.webpackStats.toJson();

      load( stats ).then( fn => {
         fn( req, res, next );
      } );
   } );

   function load( stats ) {
      const hash = stats.hash;
      return cache[ hash ] = cache[ hash ] || new Promise( ( resolve, reject ) => {
         const assets = stats.children.map( child => {
            return child.assets
               .map( asset => path.join( child.publicPath, asset.name ) );
         } );

         const scripts = assets[ 0 ].filter( path => ( /\.js$/.test( path ) && !/worker\.js$/.test( path ) ) );
         const styles = assets[ 0 ].filter( path => ( /\.css$/.test( path ) ) );
         const server = assets[ 1 ].filter( path => ( /\.js$/.test( path ) ) );

         const fs = compiler.compilers[ 1 ].outputFileSystem;
         const dirname  = compiler.compilers[ 1 ].options.context;
         const filename = path.join( dirname, server[ 0 ] );

         fs.readFile( filename, ( err, source ) => {
            if( err ) {
               reject( err );
               return;
            }

            const exports = {};
            const module = { exports: exports };
            const sandbox = Object.assign( Object.create( global ), {
               exports: exports,
               require: require,
               module: module,
               __filename: filename,
               __dirname: path.dirname( filename )
            } );
            const script = new vm.Script( source, { filename: filename } );
            const context = vm.createContext( sandbox );

            script.runInContext( context );

            resolve( ( exports.default || module.exports )( {
               scripts: scripts,
               styles: styles
            } ) );
         } );
      } );
   }
}
else {
   app.use( publicPath, express.static( __dirname + publicPath ) );
   app.use( require( '.' ) );
}

app.use( express.static( __dirname ) ); // testing

module.exports = app;

if( require.main === module ) {
   app.listen( process.env.PORT || 0 );
}
