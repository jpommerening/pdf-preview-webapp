import express from 'express';
import sockjs from 'sockjs';

import { SOCKJS_URL } from '../common/defs';

const EXTENSIONS = {
   'application/pdf': '.pdf',
   'text/html': '.html',
   'text/plain': '.txt'
};

export function renderResource( url, resource ) {
   return {
      _links: { self: url },
      nonce: resource.nonce,
      name: resource.name,
      time: resource.time,
      data: resource.data.map( item => ( {
         _links: { self: `${url}/data?type=${encodeURIComponent(item.type)}` },
         type: item.type
      } ) )
   };
}

export function renderResourceList( url, resources ) {
   const items = resources
      .map( resource => renderResource( `${url}/${encodeURIComponent(resource.nonce)}`, resource ) );
   const links = items
      .map( item => ( { href: item._links.self.href } ) );
   return {
      _links: {
         self: { href: url },
         items: links
      },
      _embedded: {
         items: items
      }
   };
}

export default function(options) {
   const app = express();
   const state = options.state || {};
   const resources = state.resources = [];

   const connections = [];
   const events = sockjs.createServer( {
      sockjs_url: SOCKJS_URL
   } );

   events.on( 'connection', connection => {
      connections.push( connection );
      connection.on( 'close', () => {
         const index = connections.findIndex( c => c === connection );
         connections.splice( index, 1 );
      } );
   } );

   app.get( '/', ( req, res, next ) => {
      res.status( 200 );
      res.send( {
         _links: {
            self: { href: req.baseUrl },
            resources: { href: `${req.baseUrl}/resources` },
            events: { href: `${req.baseUrl}/events` }
         }
      } );
   } );

   app.use( '/events', events.middleware() );

   app.get( '/resources', ( req, res, next ) => {
      res.status( 200 );
      res.send( renderResourceList( `${req.baseUrl}/resources`, resources ) );
   } );

   app.get( '/resources/:nonce', ( req, res, next ) => {
      const nonce = req.params.nonce;
      const resource = resources.find( resource => resource.nonce === nonce );

      if( resource ) {
         res.status( 200 )
         res.send( renderResource( `${req.baseUrl}/resources/${encodeURIComponent(nonce)}`, resource ) );
         return;
      }

      res.send( 404 );
   } );

   app.get( '/resources/:nonce/data', ( req, res, next ) => {
      const nonce = req.params.nonce;
      const type = req.query.type;
      const resource = resources.find( resource => resource.nonce === nonce );

      if( resource ) {
         const data = type ? resource.data.find( d => d.type === type ) : resource.data[ 0 ];

         if( data ) {
            const ext = EXTENSIONS[ data.type ] || '';

            res.status( 200 );
            res.set( 'content-disposition', `attachment; filename="${resource.name}${ext}"` );
            res.type( data.type );
            res.send( data.buffer );
            return;
         }
      }

      res.send( 404 );
   } );

   app.post( '/resources', ( req, res, next ) => {
      const buffers = [];
      req.on( 'data', buffer => { buffers.push( buffer ); } );
      req.on( 'end', buffer => {
         if( buffer ) {
            buffers.push( buffer );
         }
         const body = JSON.parse( Buffer.concat( buffers ) );

         if( !( body.name && body.nonce && body.time && body.data && Array.isArray( body.data ) ) ) {
            res.status( 400 );
            res.send( { message: 'Malformed request body.' } );
            return;
         }

         const { name, time, nonce } = body;
         const data = body.data.map( d => ( {
            type: d.type,
            buffer: Buffer.from( d.data, d.encoding )
         } ) );
         const types = data.map( d => d.type );
         const resource = { name, time, nonce, data };

         const index = resources.findIndex( resource => resource.nonce === nonce );

         if( index >= 0 ) {
            resources[ index ].data.forEach( d => {
               if( types.indexOf( d.type ) < 0 ) {
                  data.push( d );
                  types.push( d.type );
               }
            } );
            resources[ index ] = resource;
         }
         else {
            resources.push( resource );
         }

         resources.forEach( resource => {
            if( resource.name === name && resource.nonce !== nonce ) {
               resource.redirect = nonce;
               resource.data = [];
            }
         } );

         const result = renderResource( `${req.baseUrl}/resources/${encodeURIComponent(nonce)}`, resource );

         res.status( 201 );
         res.send( result );

         const jsonResult = JSON.stringify( result );

         connections.forEach( connection => {
            console.log( 'send update', name, nonce );
            connection.write( jsonResult );
         } );
      } );
   } );

   return app;
}
