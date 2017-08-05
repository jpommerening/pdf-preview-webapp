import React, { PureComponent } from 'react';

import style from '../style/spinner.scss';

export default class Spinner extends PureComponent {
   render() {
      return (
         <div className={style.Spinner}/>
      );
   }
}
