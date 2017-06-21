import * as React from 'react';
import './App.css';
import NexusUICanvas from './NexusUICanvas';

// import * as nx from 'nexusUI';
// let NUI = require('./nexusUI.js');
const logo = require('./logo.svg');

class App extends React.Component<{}, null> {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <NexusUICanvas type='dial'/>
        <NexusUICanvas type='dial'/>
      </div>

    );
  }
}

export default App;
