import React, { Component } from 'react';
import Document from './document';

import style from '../style/app.scss';

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
         <div className={style.App}>
            {this.docs.map(doc => (
               <Document file={doc} key={doc} />
            ))}
         </div>
      );
   }
}
