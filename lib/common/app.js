// @flow

import React, { Component } from 'react';
import Grid from './grid';
import Document from './document';

import style from '../style/app.scss';

type DataItem = {
   _links: { self: string },
   type: string
};

type Resource = {
   _links: { self: string },
   nonce: string,
   name: string,
   time: number,
   data: DataItem[]
};

type Props = {
   state: State
};
type State = {
   details: boolean,
   resources: Resource[]
};


export default class App extends Component {
   props: Props;
   state: State;

   constructor( props: Props ) {
      super( props );
      this.state = {
         details: false,
         resources: [],
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
                  {this.state.resources.map(resource => {
                     const pdf = resource.data.find( d => d.type === 'application/pdf' );
                     if( pdf ) {
                        return <a href={pdf._links.self} key={resource.nonce}><Document file={pdf._links.self} /></a>;
                     }
                     else {
                        return null;
                     }
                  })}
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
