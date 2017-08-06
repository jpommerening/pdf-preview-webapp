const vm = require( 'vm' );

module.exports = {
   serverSideRender: true,
   setup: ( app, server ) => {
      const middleware = server.middleware;
      const cache = {};

      app.use( middleware );
      app.use( (req, res, next) => {
         const stats = res.locals.webpackStats.toJson();

         load( cache, middleware, stats ).then( fn => {
            fn( req, res, next );
         } );
      } );
   }
};

function load( cache, middleware, stats ) {
   const hash = stats.hash;
   return cache[ hash ] = cache[ hash ] || new Promise( ( resolve, reject ) => {
      const assets = stats.children.map( child => {
         return child.assets
            .map( asset => child.publicPath + asset.name );
      } );

      const scripts = assets[ 0 ].filter( path => ( /\.js$/.test( path ) && !/worker\.js$/.test( path ) ) );
      const styles = assets[ 0 ].filter( path => ( /\.css$/.test( path ) ) );
      const server = assets[ 1 ].filter( path => ( /\.js$/.test( path ) ) );

      const fs = middleware.fileSystem;
      const filename = middleware.getFilenameFromUrl( server[ 0 ] );

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
            module: module
         } );
         const script = new vm.Script( source, { filename: filename } );
         const context = vm.createContext( sandbox );

         script.runInContext( context );

         resolve( ( exports.default || module.exports )( {
            contentBase: __dirname,
            scripts: scripts,
            styles: styles
         } ) );
      } );
   } );
}
