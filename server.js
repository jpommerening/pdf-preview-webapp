
module.exports = require( './dist/server' ).default;

if( require.main === module ) {
   const http = require( 'http' );
   http.createServer( module.exports() ).listen( process.env.PORT || 0 );
}
