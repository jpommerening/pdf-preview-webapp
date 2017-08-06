const express = require( 'express' );
const app = express();
const publicPath = '/dist/';
const middleware = require( '.' );

app.use( publicPath, express.static( __dirname + publicPath ) );
app.use( middleware() );

app.use( express.static( __dirname ) ); // testing

module.exports = app;

if( require.main === module ) {
   app.listen( process.env.PORT || 8080 );
}
