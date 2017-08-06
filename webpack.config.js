module.exports = [
   require( './webpack.browser.config' ),
   require( './webpack.server.config' )
];

module.exports[ 0 ].devServer = require( './webpack-dev-server.config.js' );
module.exports[ 0 ].plugins.push( {
   apply: compiler => {
   }
} );
module.exports[ 1 ].plugins.push( {
   apply: compiler => {
      // remove webpack dev server injections from server bundle
      const excludePattern = /(^|\/)(webpack-dev-server\/client|webpack\/hot)(\/|$)/;
      compiler.plugin( 'entry-option', ( context, entry ) => {
         if( entry.server && Array.isArray( entry.server ) ) {
            entry.server = entry.server.filter( entry => !excludePattern.test( entry ) );
         }
      } );
   }
} );
