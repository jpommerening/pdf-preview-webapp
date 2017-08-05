import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import App from '../common/app';
import Template from './template';

export default function( {
   base,
   contentBase,
   scripts = [],
   styles = []
} = {} ) {

   const fs = require( 'fs' );
   const path = require( 'path' );

   const nonce = 'asdf';
   const props = {
      docs: fs.readdirSync( contentBase + '/docs' )
         .filter( file => file.substr( -4 ) === '.pdf' )
         .map( file => `docs/${file}` )
   };

   return ( req, res, next ) => {
      if( req.url === '/' ) {
         const lang = 'en';
         const document = (
            <Template
               title="Document browser"
               base={base}
               lang={lang}
               styles={styles}
               scripts={scripts}
               props={props}>
               <App {...props}/>
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
   };
};
