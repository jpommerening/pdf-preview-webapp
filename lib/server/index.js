import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import App from '../common/app';
import Template from './template';

export default function( {
   base,
   scripts = [],
   styles = []
} = {} ) {

   return ( req, res, next ) => {
      if( req.url === '/' ) {
         const lang = 'en';
         const document = (
            <Template
               title="Hi"
               base={base}
               lang={lang}
               styles={styles}
               scripts={scripts}>
               <App/>
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
