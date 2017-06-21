import * as React from 'react';
import './App.css';
import { NexusUICanvas, NxWidget } from './NexusUICanvas';

import * as Debug from 'debug';
var debug = Debug('AudioGraph');

const logo = require('./logo.svg');

class App extends React.Component<{}, null> {
  render() {
    let dial1 = (w:NxWidget) => {
      w.on('*', (d:any) => {debug(d);});
      nx.add('dial');
    };
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <NexusUICanvas type='dial' initWidget={dial1}/>
        <NexusUICanvas type='string' initWidget={dial1}/>
        <NexusUICanvas type='button' initWidget={dial1}/>
      </div>

    );
  }
}

export default App;
