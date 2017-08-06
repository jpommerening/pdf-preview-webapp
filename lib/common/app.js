// @flow

import React, { Component } from 'react';
import Document from './document';

import style from '../style/app.scss';

type Props = {
   docs: string[]
};
type State = {
   details: boolean,
   docs: string[]
};

export default class App extends Component {
   props: Props;
   state: State;

   constructor( props: Props ) {
      super( props );
      this.state = {
         details: true,
         docs: props.docs
      };
   }
   render() {
      const className = [ style.App ].concat( [
         'details'
      ].filter( state => this.state[ state ] ) );

      return (
         <div className={className.join(' ')}>
            <div className="main">
               <div className={style.Grid}>
                  {this.state.docs.map(doc => (
                     <Document file={doc} key={doc} />
                  ))}
               </div>
            </div>
            <div className="sidebar" onClick={() => this.setState( { details: false } )}>
               Sidebar
            </div>
         </div>
      );
   }
}
