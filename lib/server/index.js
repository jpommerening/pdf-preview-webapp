// @flow

import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import App from '../common/app';
import Template from './template';

import express from 'express';
import api, { renderDocument, renderDocumentList } from './api';

type Options = {
   base?: string,
   contentBase: string,
   scripts?: string[],
   styles?: string[],
   assets?: string[],
   props?: any,
   state?: any
};

export default function( {
   base,
   contentBase,
   scripts = [],
   styles = [],
   assets = [],
   props = {},
   state = {}
}: Options = {} ) {

   const app = express();

   app.use( '/api', api( { props, state } ) );

   app.use( ( req, res, next ) => {

      const file = req.url.replace( /^\//, '' );

      res.locals = res.locals || {};

      if( assets.indexOf( file ) >= 0 ) {
         res.sendFile( file, { root: contentBase } );
         return;
      }

      if( req.url === '/' ) {
         res.locals.props = {
            api: `${req.baseUrl}/api`
         };
         res.locals.state = {
            documents: state.documents
               .map( document => renderDocument( `${req.baseUrl}/api/documents/${encodeURIComponent(document.name)}`, document ) )
         };
      }

      if( res.locals.state || res.locals.props ) {
         try {
            const lang = 'en';
            const template = (
               <Template
                  title="Document browser"
                  base={base}
                  lang={lang}
                  styles={styles}
                  scripts={scripts}
                  props={res.locals.props}
                  state={res.locals.state}>
                  <App state={res.locals.state} {...res.locals.props} />
               </Template>
            );

            res.status( 200 );
            res.type( 'html' );
            res.send( '<!DOCTYPE html>\n' + renderToStaticMarkup( template ) );
         }
         catch( err ) {
            next( err );
         }
         return;
      }

      if( next ) {
         next();
      }
   } );

   return app;
};
