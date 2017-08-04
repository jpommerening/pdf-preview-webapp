global.File = function File() { throw new Error( 'File() not implemented' ); };
global.Blob = function Blob() { throw new Error( 'Blob() not implemented' ); };

module.exports = require( './dist/server' ).default;

if( require.main === module ) {
   const http = require( 'http' );
   http.createServer( module.exports() ).listen( process.env.PORT || 0 );
}
