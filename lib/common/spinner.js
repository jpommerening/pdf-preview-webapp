// @flow

import React, { PureComponent } from 'react';

import style from '../style/spinner.scss';

type Props = {
   progress?: number
};

export default class Spinner extends PureComponent {
   props: Props;

   render() {
      return (
         <div className={style.Spinner}>
            <div className="left"><div className="fill" /></div>
            <div className="right"><div className="fill" /></div>
         </div>
      );
   }
}
