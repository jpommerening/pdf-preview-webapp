import React, { Component } from 'react';
import PDF from 'react-pdf/build/react-pdf';

import { App as className } from '../style/app.scss';

export default class App extends Component {
   constructor( props ) {
      super( props );
      this.docs = [
         'manual.pdf',
         'manual-1.pdf',
         'manual-2.pdf',
         'manual-3.pdf',
         'manual-4.pdf',
         'manual-5.pdf'
      ];
   }
   render() {
      return (
         <div className={className}>
            <h1>Hi</h1>
            <div className="grid">
               {this.docs.map(doc => (
                  <div className="doc" key={doc}>
                     <PDF file={doc} width={200} />
                  </div>
               ))}
            </div>
         </div>
      );
   }
}
