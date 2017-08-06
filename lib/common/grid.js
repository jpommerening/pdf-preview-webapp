// @flow

import React, { PureComponent, Children } from 'react';

import style from '../style/grid.scss';

export default class Grid extends PureComponent {
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
