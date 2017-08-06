const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const DEV_ENTRIES_PATTERN = /(^|\/)(webpack-dev-server\/client|webpack\/hot)(\/|$)/;

module.exports = [
   require( './webpack.browser.config' ),
   require( './webpack.server.config' )
];

module.exports[ 0 ].devServer = require( './webpack-dev-server.config.js' );
module.exports[ 0 ].plugins.push( {
   apply: compiler => {
      compiler.plugin( 'entry-option', ( context, entry ) => {
         if(
            entry.browser && Array.isArray( entry.browser ) &&
            entry.browser.some( entry => DEV_ENTRIES_PATTERN.test( entry ) )
         ) {
            entry.browser.unshift( 'react-hot-loader/patch' );
            module.exports[ 0 ].plugins.forEach( p => {
               if( p instanceof ExtractTextPlugin ) {
                  console.log( 'disable etp' );
                  p.options.disable = true;
               }
            } );
         }
      } );
   }
} );
module.exports[ 1 ].plugins.push( {
   apply: compiler => {
      // remove webpack dev server injections from server bundle
      compiler.plugin( 'entry-option', ( context, entry ) => {
         if( entry.server && Array.isArray( entry.server ) ) {
            entry.server = entry.server.filter( entry => !DEV_ENTRIES_PATTERN.test( entry ) );
         }
      } );
   }
} );
