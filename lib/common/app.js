// @flow

import React, { Component } from 'react';
import Grid from './grid';
import Document from './document';

import style from '../style/app.scss';

type Props = {
   state: State
};
type State = {
   details: boolean,
   display: ?string,
   docs: string[]
};

export default class App extends Component {
   props: Props;
   state: State;

   constructor( props: Props ) {
      super( props );
      this.state = {
         details: false,
         docs: [],
         ...props.state
      };
   }
   render() {
      const className = [ style.App ].concat( [
         'details'
      ].filter( state => this.state[ state ] ) );

      return (
         <div className={className.join(' ')}>
            <div className="main">
               <Grid>
                  {( this.state.display ? [ this.state.display ] : this.state.docs ).map(doc => (
                     <a href={'/display/' + doc} key={doc}><Document file={doc} key={doc} /></a>
                  ))}
               </Grid>
            </div>
            <div className="sidebar">
            </div>
            <div className="controls">
               <a className="button" href={this.state.details ? '#' : '#details'} onClick={() => this.setState( state => ( {
                  details: !state.details
               } ) )}>Details</a>
            </div>
         </div>
      );
   }
}
