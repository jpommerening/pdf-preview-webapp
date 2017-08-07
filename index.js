const middleware = require( './dist/server' ).default;

module.exports = function( options ) {
   return middleware( Object.assign( {
      contentBase: __dirname,
      scripts: [ 'dist/browser.js' ],
      styles: [ 'dist/style.css' ],
      assets: [
         'dist/browser.js',
         'dist/browser.js.map',
         'dist/style.css',
         'dist/style.css.map',
         'dist/66d3c7fee01f3bc37029.worker.js',
         'dist/66d3c7fee01f3bc37029.worker.js.map'
      ]
   }, options ) );
};
