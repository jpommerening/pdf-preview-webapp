const middleware = require( './dist/server' ).default;

module.exports = function( options ) {
   return middleware( Object.assign( {
      contentBase: __dirname,
      scripts: [ 'dist/browser.js' ],
      styles: [ 'dist/style.css' ]
   }, options ) );
};
