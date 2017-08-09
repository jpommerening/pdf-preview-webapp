module.exports = function( options ) {
   const stats = require( './dist/stats.json' );
   const defaults = optionsFromStats( stats );
   const middleware = require( './dist/server' ).default;

   return middleware( Object.assign( {
      contentBase: __dirname
   }, defaults, options ) );
};

module.exports.optionsFromStats = optionsFromStats;

function optionsFromStats( stats ) {
   const publicPath = stats.publicPath;

   const assets = [];
   const scripts = [];
   const styles = [];

   stats.assets.forEach( asset => {
      const file = publicPath + asset.name;
      assets.push( file );
      if( asset.chunks.length > 0 ) {
         if( file.substr( -3 ) === '.js' ) {
            scripts.push( file );
         }
         else if( file.substr( -4 ) === '.css' ) {
            styles.push( file );
         }
      }
   } );

   return {
      scripts: scripts,
      styles: styles,
      assets: assets
   };
}
