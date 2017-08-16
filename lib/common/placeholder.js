// @flow

import React, { Component } from 'react';
import Spinner from './spinner';

import style from '../style/placeholder.scss';

export default class Placeholder extends Component {
   render() {
      return (
         <div className={style.Placeholder}>
            <Spinner {...this.props} />
            <div className={style.Message}>{this.props.children}</div>
         </div>
      );
   }
}
