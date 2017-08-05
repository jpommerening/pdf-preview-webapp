const middleware = require( './dist/server' ).default;

module.exports = function( options ) {
   return middleware( Object.assign( {
      scripts: [ path.join( __dirname, 'dist/browser.js' ) ],
      styles: [ path.join( __dirname, 'dist/style.css' ) ]
   }, options ) );
};
