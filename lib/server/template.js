import React, { PureComponent } from 'react';
import { renderToString } from 'react-dom/server';

import {
   APPLICATION_ANCHOR_ID,
   PRELOADED_PROPS_VAR,
   PRELOADED_STATE_VAR
} from '../common/defs';

function Script( props ) {
   const source = Buffer.from( props.source );
   const encoded = source.toString( 'base64' );
   const dataUrl = `data:application/javascript;base64,${encoded}`;
   return <script src={dataUrl} />;
}

export default class Template extends PureComponent {
   static defaultProps = {
      lang: 'en',
      anchorId: APPLICATION_ANCHOR_ID,
      propsVar: PRELOADED_PROPS_VAR,
      stateVar: PRELOADED_STATE_VAR,
      styles: [],
      scripts: [],
      props: {},
      state: {}
   }

   render() {
      const source = [
         `window[ '${PRELOADED_PROPS_VAR}' ] = ${JSON.stringify(this.props.props)};`,
         `window[ '${PRELOADED_STATE_VAR}' ] = ${JSON.stringify(this.props.state)};`
      ].join( '\n' );

      return (
         <html lang={this.props.lang}>
            <head>
               <meta charset="UTF-8"/>
               <title>{this.props.title}</title>
               {this.props.base ? <base href={this.props.base} /> : null}
               {this.props.styles.map(file => <link key={file} rel="stylesheet" href={file} />)}
            </head>
            <body>
               <div
                  id={this.props.anchorId}
                  dangerouslySetInnerHTML={{ __html: renderToString(this.props.children) }} />
               <Script source={source}/>
               {this.props.scripts.map(file => <script key={file} src={file}></script>)}
            </body>
         </html>
      );
   }
}
