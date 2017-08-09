const express = require( 'express' );
const middleware = require( '.' );

const app = express();

app.use( middleware() );
app.use( express.static( __dirname ) ); // testing

module.exports = app;

if( require.main === module ) {
   app.listen( process.env.PORT || 8080 );
}
