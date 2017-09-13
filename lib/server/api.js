// @flow

import express from 'express';
import sockjs from 'sockjs';

import type {
   ApiRootModel,
   DocumentListModel,
   DocumentModel
} from '../common/model';

const EXTENSIONS = {
   'application/pdf': '.pdf',
   'text/html': '.html',
   'text/plain': '.txt'
};

type InternalDocumentModel = {
   name: string,
   time: number,
   data: Array<{
      type: string,
      buffer: Buffer
   }>
};

export function renderDocument( url: string, document: InternalDocumentModel ): DocumentModel {
   return {
      _links: { self: { href: url } },
      name: document.name,
      time: document.time,
      data: document.data.map( item => ( {
         href: `${url}/data?type=${encodeURIComponent(item.type)}`,
         type: item.type
      } ) )
   };
}

export function renderDocumentList( url: string, documents: InternalDocumentModel[] ): DocumentListModel {
   const items = documents
      .map( document => renderDocument( `${url}/${encodeURIComponent(document.name)}`, document ) );
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

function renderApiRoot( url: string ): ApiRootModel {
   return {
      _links: {
         self: { href: url },
         documents: { href: `${url}/documents` },
         events: { href: `${url}/events` }
      }
   };
}

export default function( options: { state?: * } ) {

   const app = express.Router();
   const state = options.state || {};
   const documents = state.documents = ( state.documents || [] );

   const connections = [];
   const events = sockjs.createServer();

   events.on( 'connection', connection => {
      connections.push( connection );
      connection.on( 'close', () => {
         const index = connections.findIndex( c => c === connection );
         connections.splice( index, 1 );
      } );
   } );

   app.get( '/', ( req, res, next ) => {
      res.status( 200 );
      res.send( renderApiRoot( req.baseUrl ) );
   } );

   app.use( '/events', events.middleware() );

   app.get( '/documents', ( req, res, next ) => {
      res.status( 200 );
      res.set( 'cache-control', 'no-cache' );
      res.send( renderDocumentList( `${req.baseUrl}/documents`, documents ) );
   } );

   app.get( '/documents/:name', ( req, res, next ) => {
      const name = req.params.name;
      const document = documents.find( document => document.name === name );

      if( document ) {
         res.status( 200 )
         res.send( renderDocument( `${req.baseUrl}/documents/${encodeURIComponent(name)}`, document ) );
         return;
      }

      res.status( 404 );
      res.end();
   } );

   app.get( '/documents/:name/data', ( req, res, next ) => {
      const name = req.params.name;
      const type = req.query.type;
      const document = documents.find( document => document.name === name );

      if( document ) {
         const data = type ? document.data.find( d => d.type === type ) : document.data[ 0 ];

         if( data ) {
            const ext = EXTENSIONS[ data.type ] || '';

            res.status( 200 );
            res.set( 'content-disposition', `inline; filename="${encodeURIComponent(document.name+ext)}"` );
            res.type( data.type );
            res.send( data.buffer );
            return;
         }
      }

      res.status( 404 );
      res.end();
   } );

   app.post( '/documents', ( req, res, next ) => {
      const buffers = [];
      req.on( 'data', buffer => { buffers.push( buffer ); } );
      req.on( 'end', buffer => {
         if( buffer ) {
            buffers.push( buffer );
         }
         const body = JSON.parse( Buffer.concat( buffers ).toString() );

         if( !( body.name && body.time && body.data && Array.isArray( body.data ) ) ) {
            res.status( 400 );
            res.send( { message: 'Malformed request body.' } );
            return;
         }

         const { name, time } = body;
         const data = body.data.map( d => ( {
            type: d.type,
            buffer: Buffer.from( d.data, d.encoding )
         } ) );
         const types = data.map( d => d.type );
         const document = { name, time, data };

         const index = documents.findIndex( document => document.name === name );

         if( index >= 0 ) {
            documents[ index ].data.forEach( d => {
               if( types.indexOf( d.type ) < 0 ) {
                  data.push( d );
                  types.push( d.type );
               }
            } );
            documents[ index ] = document;
         }
         else {
            documents.push( document );
         }

         const result = renderDocument( `${req.baseUrl}/documents/${encodeURIComponent(name)}`, document );

         res.status( 201 );
         res.send( result );

         const jsonResult = JSON.stringify( result );

         connections.forEach( connection => {
            connection.write( jsonResult );
         } );
      } );
   } );

   return app;
}
