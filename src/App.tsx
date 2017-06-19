import * as React from 'react';
import './App.css';
import * as SL from './Audio/SynthLib';
import Controls from './View/containers/Controls';

const logo = require('./logo.svg'); 

// tslint:disable-next-line:no-unused-expression
new SL.Synth();

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
        <Controls volume={1.0}/>
        
      </div>
    );
  }
}

export default App;
