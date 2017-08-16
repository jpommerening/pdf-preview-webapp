const vm = require( 'vm' );
const optionsFromStats = require( '.' ).optionsFromStats;

const PROPS = {};
const STATE = {};

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
      const browser = optionsFromStats( stats.children[ 0 ] );
      const server = optionsFromStats( stats.children[ 1 ] );

      const fs = middleware.fileSystem;
      const filename = middleware.getFilenameFromUrl( server.scripts[ 0 ] );

      fs.readFile( filename, ( err, source ) => {
         if( err ) {
            reject( err );
            return;
         }

         try {
            const exports = exec( source, filename );
            const options = Object.assign( {
               contentBase: __dirname,
               props: PROPS,
               state: STATE
            }, browser );

            resolve( exports( options ) );
         }
         catch( err ) {
            reject( err );
         }
      } );
   } );
}

function exec( source, filename ) {
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

   return ( exports.default || module.exports );
}
