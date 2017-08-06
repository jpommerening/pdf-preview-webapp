// @flow

import App from '../common/app';
import React from 'react';
import { render } from 'react-dom';

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

render( <App {...props} />, document.getElementById( APPLICATION_ANCHOR_ID ) );
