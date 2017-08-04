import App from '../common/app';
import React, { Component } from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';

class Document extends Component {
   static defaultProps = {
      lang: 'en',
      anchorId: 'app',
      styles: [],
      scripts: []
   }

   render() {
      return (
         <html lang={this.props.lang}>
            <head>
               <meta charset="UTF-8"/>
               <title>{this.props.title}</title>
               {this.props.base ? <base href={this.props.base} /> : null}
               {this.props.styles.map(file => <link key={file} rel="stylesheet" href={file} />)}
            </head>
            <body>
               <div
                  id={this.props.anchorId}
                  dangerouslySetInnerHTML={{ __html: renderToString(this.props.children) }} />
               {this.props.scripts.map(file => <script key={file} src={file}></script>)}
            </body>
         </html>
      );
   }
}

export default function( options ) {
   const base = null;

   return ( req, res, next ) => {
      if( req.url === '/' ) {
         const document = (
            <Document
               title="Hi"
               base={base}
               styles={[ 'dist/style.css' ]}
               scripts={[ 'dist/browser.js' ]}>
               <App/>
            </Document>
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
