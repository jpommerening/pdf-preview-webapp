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
      ( this: any ).nextPage = this.nextPage.bind( this );
      ( this: any ).prevPage = this.prevPage.bind( this );
   }

   onDocumentLoad( { total }: any ) {
      this.setState( { total, loaded: true } );
   }

   onPageLoad( { pageIndex, pageNumber }: any ) {
      this.setState( { pageIndex, pageNumber } );
   }

   onPageRender() {
      this.setState( { rendered: true } );
   }

   nextPage( event: MouseEvent ) {
      event.preventDefault();
      this.setState( state => ( {
         pageIndex: state.pageIndex + 1
      } ) );
   }

   prevPage( event: MouseEvent ) {
      event.preventDefault();
      this.setState( state => ( {
         pageIndex: state.pageIndex - 1
      } ) );
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
                     pageIndex={this.state.pageIndex}
                     loading={<Spinner ref={spinner => {
                        this.setState( { loading: !!(spinner) } );
                     }}/>}
                  />
               </a>
            ) : null}
            {this.state.rendered ? <div className={style.Overlay} onClick={this.nextPage}>
               page {this.state.pageNumber} of {this.state.total}
            </div> : null}
         </div>
      );
   }
}
