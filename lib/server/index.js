import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import App from '../common/app';
import Template from './template';

export default function( {
   base,
   scripts = [],
   styles = []
} = {} ) {

   const nonce = 'asdf';
   const props = {
      docs: [
         'manual.pdf',
         'manual-1.pdf',
         'manual-2.pdf',
         'manual-3.pdf',
         'manual-4.pdf',
         'manual-5.pdf'
      ]
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
