// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import Spinner from './spinner';

import style from '../style/placeholder.scss';

type Props = $PropertyType<Spinner, 'props'> & {
   children: Node
};

export default class Placeholder extends Component<Props> {
   render() {
      return (
         <div className={style.Placeholder}>
            <Spinner {...this.props} />
            <div className={style.Message}>{this.props.children}</div>
         </div>
      );
   }
}
