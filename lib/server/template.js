import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';

export default class Template extends Component {
   static defaultProps = {
      lang: 'en',
      anchorId: 'app',
      styles: [],
      scripts: []
   }

   render() {
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
               {this.props.scripts.map(file => <script key={file} src={file}></script>)}
            </body>
         </html>
      );
   }
}
