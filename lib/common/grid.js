// @flow

import React, { PureComponent, Children } from 'react';
import type { Node } from 'react';

import style from '../style/grid.scss';

type Props = {
   children?: Node
};

export default class Grid extends PureComponent<Props> {
   render() {
      return (
         <ul className={style.Grid}>
            {Children.map(this.props.children, child => (
               <li className={style.Grid}>{child}</li>
            ))}
         </ul>
      );
   }
}
