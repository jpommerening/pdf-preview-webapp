// @flow

import App from '../common/app';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import {
   APPLICATION_ANCHOR_ID,
   PRELOADED_PROPS_VAR,
   PRELOADED_STATE_VAR
} from '../common/defs';

import '../style/main.scss';

import './pdfjs';

const props = window[ PRELOADED_PROPS_VAR ];
const state = window[ PRELOADED_STATE_VAR ];

delete window[ PRELOADED_PROPS_VAR ];
delete window[ PRELOADED_STATE_VAR ];

const container = document.getElementById( APPLICATION_ANCHOR_ID );
const Element = () => <AppContainer><App state={state} {...props} /></AppContainer>;

if( container ) {
   render( <Element/>, container );

   if( module.hot ) {
      // $FlowFixMe
      module.hot.accept( '../common/app', () => render( <Element/>, container ) );
   }
}
