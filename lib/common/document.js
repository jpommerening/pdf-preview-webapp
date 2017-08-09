// @flow

import React, { Component } from 'react';
import PDF from 'react-pdf/build/react-pdf';
import Spinner from './spinner';

import type { DocumentModel, DataItemModel } from './model';

import style from '../style/document.scss';

const PDF_TYPE = /^application\/(.+-)?pdf$/i;

type Props = DocumentModel;
type State = {
   loading: boolean,
   loaded: boolean,
   rendered: boolean,
   total: number,
   pageIndex: number,
   pageNumber: number
};

export default class Document extends Component {
   props: Props;
   state: State;

   constructor( props: Props ) {
      super( props );
      this.state = {
         loading: false,
         loaded: false,
         rendered: false,
         total: 0,
         pageIndex: 0,
         pageNumber: 0
      };

      ( this: any ).onDocumentLoad = this.onDocumentLoad.bind( this );
      ( this: any ).onPageLoad = this.onPageLoad.bind( this );
      ( this: any ).onPageRender = this.onPageRender.bind( this );
      ( this: any ).onDocumentError = this.onDocumentError.bind( this );
      ( this: any ).onPageError = this.onPageError.bind( this );

      ( this: any ).setPage = this.setPage.bind( this );
      ( this: any ).selectPage = this.selectPage.bind( this );
   }

   onDocumentLoad( { total }: { total: number } ) {
      this.setState( { total, loaded: true } );
   }

   onPageLoad( { pageIndex, pageNumber }: { pageIndex: number, pageNumber: number } ) {
      this.setState( { pageIndex, pageNumber } );
   }

   onPageRender() {
      this.setState( { rendered: true } );
   }

   onDocumentError( event: { message: string } ) {
      console.log( event );
   }

   onPageError( event: { message: string } ) {
      console.log( event );
   }

   setPage( pageIndex: number | (State => number) ) {
      const newIndex = pageIndex;

      this.setState( state => {
         const pageIndex = typeof newIndex === 'number' ? newIndex : newIndex( state );
         if( pageIndex === state.pageIndex ) {
            return;
         }
         if( !state.rendered ) {
         }
         else {
            this.setState( { rendered: false, pageIndex } );
         }
      } );
   }

   selectPage( event: MouseEvent ) {
      const target = event.target;
      if( target instanceof HTMLElement ) {
         const total = this.state.total;
         const rect = target.getBoundingClientRect();
         const normalizedOffset = ( event.pageX - rect.left ) / rect.width;
         const pageIndex = Math.min( total, Math.floor( normalizedOffset * total ) );
         this.setPage( pageIndex );
      }
   }

   render() {
      const document: DocumentModel = this.props;
      const pdfData: ?DataItemModel = document.data.find( d => PDF_TYPE.test( d.type ) );

      const classNames = [ style.Document ].concat( [
         'loaded', 'loading', 'rendered'
      ].filter( state => this.state[ state ] ) );

      return (
         <div className={classNames.join(' ')}>
            {pdfData ? (
               <a href={pdfData._links.self.href} title={document.name}>
                  <PDF file={pdfData._links.self.href} width={180}
                     onDocumentLoad={this.onDocumentLoad}
                     onPageLoad={this.onPageLoad}
                     onPageRender={this.onPageRender}
                     onDocumentError={this.onDocumentError}
                     onPageError={this.onPageError}
                     pageIndex={this.state.pageIndex}
                     loading={<Spinner ref={spinner => {
                        this.setState( { loading: !!(spinner) } );
                     }}/>}
                  />
               </a>
            ) : null}
            {this.state.loaded ? <div className={style.Overlay} onMouseMove={this.selectPage}>
               <div>{document.name}</div>
               <div>page {this.state.pageNumber} of {this.state.total}</div>
            </div> : null}
         </div>
      );
   }
}
