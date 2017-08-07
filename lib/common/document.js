import React, { Component } from 'react';
import PDF from 'react-pdf/build/react-pdf';
import Spinner from './spinner';

import style from '../style/document.scss';

export default class Document extends Component {
   constructor( props ) {
      super( props );
      this.state = {
         loading: false,
         loaded: false,
         rendered: false,
         total: 0,
         pageIndex: 0,
         pageNumber: 0
      };

      this.onDocumentLoad = ({ total }) => {
         this.setState({ total, loaded: true });
      };

      this.onPageRender = () => {
         this.setState({ rendered: true });
      };

      this.onPageLoad = stats => this.setState( stats );

      this.nextPage = event => {
         event.preventDefault();
         this.setState( state => ( {
            pageIndex: state.pageIndex + 1
         } ) );
      };

      this.prevPage = event => {
         event.preventDefault();
         this.setState( state => ( {
            pageIndex: state.pageIndex - 1
         } ) );
      };
   }

   render() {
      const classNames = [ style.Document ].concat( [
         'loaded', 'loading', 'rendered'
      ].filter( state => this.state[ state ] ) );

      return (
         <div className={classNames.join(' ')}>
            <PDF file={this.props.file} width={180}
               onDocumentLoad={this.onDocumentLoad}
               onPageLoad={this.onPageLoad}
               onPageRender={this.onPageRender}
               pageIndex={this.state.pageIndex}
               loading={<Spinner ref={spinner => {
                  this.setState( { loading: !!(spinner) } );
               }}/>}
            />
            {this.state.rendered ? <div className={style.Overlay} onClick={this.nextPage}>
               page {this.state.pageNumber} of {this.state.total}
            </div> : null}
         </div>
      );
   }
}
