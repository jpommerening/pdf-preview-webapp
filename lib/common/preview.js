// @flow

import React, { Component } from 'react';
import Document from 'react-pdf/build/Document';
import Page from 'react-pdf/build/Page';
import Spinner from './spinner';

import type { DocumentModel, DataItemModel } from './model';

import style from '../style/preview.scss';

const TYPE_ICONS = {
   'application/pdf': 'file-pdf-o',
   'text/html': 'file-code-o',
   'default': 'file-o'
};

const PDF_TYPE = /^application\/(.+-)?pdf$/i;

type Props = DocumentModel;
type State = {
   loading: boolean,
   loaded: boolean,
   error: boolean,
   rendered: boolean,
   numPages: number,
   pageIndex: number,
   pageNumber: number
};

export default class Preview extends Component<Props, State> {
   constructor( props: Props ) {
      super( props );
      this.state = {
         loading: true,
         loaded: false,
         error: false,
         rendered: false,
         numPages: 0,
         pageIndex: 0,
         pageNumber: 0
      };

      ( this: any ).onLoadSuccess = this.onLoadSuccess.bind( this );
      ( this: any ).onRenderSuccess = this.onRenderSuccess.bind( this );

      ( this: any ).onError = this.onError.bind( this );

      ( this: any ).setPage = this.setPage.bind( this );
      ( this: any ).selectPage = this.selectPage.bind( this );
   }

   onError( event: { message: string } ) {
      this.setState( { error: true, loading: false } );
   }

   onLoadSuccess( { numPages }: { numPages: number } ) {
      this.setState( { numPages, loaded: true, loading: false } );
   }

   onRenderSuccess() {
      this.setState( { rendered: true } );
   }

   setPage( pageIndex: number | (State => number) ) {
      const newIndex = pageIndex;

      this.setState( state => {
         const pageIndex = typeof newIndex === 'number' ? newIndex : newIndex( state );
         if( pageIndex === state.pageIndex ) {
            return;
         }
         if( !state.rendered ) {
            return;
         }

         return { rendered: false, pageIndex };
      } );
   }

   selectPage( event: MouseEvent ) {
      const target = event.target;
      if( target instanceof HTMLElement ) {
         const numPages = this.state.numPages;
         const rect = target.getBoundingClientRect();
         const normalizedOffset = ( event.pageX - rect.left ) / rect.width;
         const pageIndex = Math.min( numPages, Math.floor( normalizedOffset * numPages ) );
         this.setPage( pageIndex );
      }
   }

   render() {
      const document: DocumentModel = this.props;
      const pdfData: ?DataItemModel = document.data.find( d => PDF_TYPE.test( d.type ) );

      const classNames = [ style.Preview ].concat( [
         'loaded', 'loading', 'rendered'
      ].filter( state => this.state[ state ] ) );

      return (
         <div className={classNames.join(' ')}>
            {pdfData ? (
               <Document file={pdfData.href}
                  loading={<Spinner/>}
                  onLoadError={this.onError}
                  onSourceError={this.onError}
                  onLoadSuccess={this.onLoadSuccess}>
                  <Page pageIndex={this.state.pageIndex}
                     onLoadError={this.onError}
                     onRenderError={this.onError}
                     onRenderSuccess={this.onRenderSuccess}
                     renderTextLayer={false}
                     width={180} />
               </Document>
            ) : null}
            {this.state.loaded ? <div className={style.Overlay}>
               <div className="name">{document.name}</div>
               <div>page {this.state.pageNumber} of {this.state.numPages}</div>
               {document.data.map(d => <div key={d.href}>
                  <a href={d.href} title={document.name}><i className={'fa fa-' + (TYPE_ICONS[ d.type ] || TYPE_ICONS.default)} /> {d.type}</a>
               </div>)}
            </div> : null}
         </div>
      );
   }
}
