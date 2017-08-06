import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import App from '../common/app';
import Template from './template';

import express from 'express';
import api from './api';

export default function( {
   base,
   contentBase,
   scripts = [],
   styles = []
} = {} ) {

   const fs = require( 'fs' );
   const path = require( 'path' );

   const props = {
      docs: fs.readdirSync( contentBase + '/docs' )
         .filter( file => file.substr( -4 ) === '.pdf' )
         .map( file => `docs/${file}` )
   };
   const state = {};

   const app = express();

   app.use( '/api', api( { state } ) );

   app.use( ( req, res, next ) => {

      res.locals = res.locals || {};

      if( req.url.substr( 0, 9 ) === '/display/' && props.docs.indexOf( req.url.substr( 9 ) ) >= 0 ) {
         res.locals.props = {};
         res.locals.state = {
            display: req.url.substr( 9 ),
            docs: props.docs
         };
      }

      if( req.url === '/' ) {
         res.locals.props = {};
         res.locals.state = {
            docs: props.docs
         };
      }

      if( res.locals.state || res.locals.props ) {
         const lang = 'en';
         const document = (
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

         res.statusCode = 200;
         res.statusMessage = 'Ok';
         res.setHeader( 'content-type', 'text/html' );
         res.write( '<!DOCTYPE html>\n' );
         res.write( renderToStaticMarkup( document ) );
         res.end();
         return;
      }

      if( next ) {
         next();
      }
   } );

   return app;
};
