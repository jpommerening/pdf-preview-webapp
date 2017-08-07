import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import App from '../common/app';
import Template from './template';

import express from 'express';
import api, { renderResource, renderResourceList } from './api';

export default function( {
   base,
   contentBase,
   scripts = [],
   styles = [],
   assets = []
} = {} ) {

   const fs = require( 'fs' );
   const path = require( 'path' );

   const props = {};
   const state = {};

   const app = express();

   app.use( '/api', api( { state, props } ) );

   app.use( ( req, res, next ) => {

      res.locals = res.locals || {};

         /*
      if( req.url.substr( 0, 9 ) === '/display/' && props.docs.indexOf( req.url.substr( 9 ) ) >= 0 ) {
         res.locals.props = {};
         res.locals.state = {
            display: req.url.substr( 9 ),
            docs: props.docs
         };
      }
      */

      const file = req.url.replace( /^\//, '' );
      const files = assets.concat( scripts, styles );

      if( files.indexOf( file ) >= 0 ) {
         res.sendFile( file, { root: contentBase } );
         return;
      }

      if( req.url === '/' ) {
         res.locals.props = {
            api: `${req.baseUrl}/api`
         };
         res.locals.state = {
            resources: state.resources
               .map( resource => renderResource( `${req.baseUrl}/api/resources/${encodeURIComponent(resource.nonce)}`, resource ) )
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
