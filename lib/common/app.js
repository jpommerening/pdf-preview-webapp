// @flow

import React, { Component } from 'react';
import Grid from './grid';
import Document from './document';
import Spinner from './spinner';
import SockJS from 'sockjs-client';

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
   state: State,
   api: string
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

   componentDidMount() {
      fetch( this.props.api )
         .then( response => ( response.ok && response.json() ) )
         .then( data => {
            if( !(data && data._links) ) {
               return;
            }

            if( data._links.events && data._links.events.href ) {
               this.subscribeResources( data._links.events.href );
            }

            if( data._links.resources && data._links.resources.href ) {
               this.fetchResources( data._links.resources.href );
            }
         } );
   }

   fetchResources( url: string ): Promise<Resource[]> {
      return fetch( this.props.api + '/resources' )
         .then( response => ( response.ok && response.json() ) )
         .then( data => {
            if( data && data._embedded && data._embedded ) {
               const resources = Array.isArray( data._embedded.items ) ? data._embedded.items : [];
               this.receiveResources( resources );
               return resources;
            }
            return this.state.resources;
         } );
   }

   subscribeResources( url: string ): Promise<void> {
      return new Promise( (resolve, reject) => {
         const sock = new SockJS( url );
         let resolved = false;

         sock.onopen = () => {
            if( !resolved ) {
               resolved = true;
               resolve();
            }
         };
         sock.onerror = err => {
            if( !resolved ) {
               resolved = true;
               reject( err );
            }
         };
         sock.onmessage = event => {
            const resource = JSON.parse( event.data );
            const { name, nonce } = resource;

            this.receiveResources( [ resource ] );
         };
         sock.onclose = () => {};
      } );
   }

   receiveResources( resources: Resource[] ) {
      const names = resources.map( r => r.name );

      this.setState( state => ({
         resources: [
            ...resources,
            ...state.resources.filter( r => names.indexOf( r.name ) < 0 )
         ]
      }) );
   }

   render() {
      const className = [ style.App ].concat( [
         'details'
      ].filter( state => this.state[ state ] ) );
      const resources = this.state.resources.sort( ( a, b ) => ( b.time - a.time ) );

      return (
         <div className={className.join(' ')}>
            <div className="main">
               {resources.length ? (
                  <Grid>{resources.map(resource => {
                     const pdf = resource.data.find( d => d.type === 'application/pdf' );
                     return pdf ? <a href={pdf._links.self} key={resource.nonce}><Document file={pdf._links.self} /></a> : null;
                  })}</Grid> ) : (
                  <div className="info">
                     <div className="spinner">
                        <Spinner />
                     </div>
                     <div className="message">Waiting for documents to appear…</div>
                  </div>
               )}
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
