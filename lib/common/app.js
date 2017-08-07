// @flow

import React, { Component } from 'react';
import Grid from './grid';
import Document from './document';
import Spinner from './spinner';
import SockJS from 'sockjs-client';

import type { DocumentModel } from './model';

import style from '../style/app.scss';

type Props = {
   state: State,
   api: string
};
type State = {
   details: boolean,
   documents: DocumentModel[]
};


export default class App extends Component {
   props: Props;
   state: State;

   constructor( props: Props ) {
      super( props );
      this.state = {
         details: false,
         documents: [],
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
               this.subscribeDocumentModels( data._links.events.href );
            }

            if( data._links.documents && data._links.documents.href ) {
               this.fetchDocumentModels( data._links.documents.href );
            }
         } );
   }

   fetchDocumentModels( url: string ): Promise<DocumentModel[]> {
      return fetch( this.props.api + '/documents' )
         .then( response => ( response.ok && response.json() ) )
         .then( data => {
            if( data && data._embedded && data._embedded ) {
               const documents = Array.isArray( data._embedded.items ) ? data._embedded.items : [];
               this.receiveDocumentModels( documents );
               return documents;
            }
            return this.state.documents;
         } );
   }

   subscribeDocumentModels( url: string ): Promise<void> {
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
            const document = JSON.parse( event.data );
            const { name, nonce } = document;

            this.receiveDocumentModels( [ document ] );
         };
         sock.onclose = () => {};
      } );
   }

   receiveDocumentModels( documents: DocumentModel[] ) {
      const names = documents.map( r => r.name );

      this.setState( state => ({
         documents: [
            ...documents,
            ...state.documents.filter( r => names.indexOf( r.name ) < 0 )
         ]
      }) );
   }

   render() {
      const className = [ style.App ].concat( [
         'details'
      ].filter( state => this.state[ state ] ) );
      const documents = this.state.documents.sort( ( a, b ) => ( b.time - a.time ) );

      return (
         <div className={className.join(' ')}>
            <div className="main">
               {documents.length ? (
                  <Grid>{documents.map(document => <Document key={document.nonce} {...document} />)}</Grid>
               ) : (
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
