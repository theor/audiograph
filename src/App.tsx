import * as React from 'react';
import './App.css';
import * as SL from './Audio/SynthLib';
import Controls from './View/containers/Controls';
import { PlayerState } from './View/types/index';
// import { PlayerState } from './View/types/index';
import * as Tone from 'tone';
// let Tone = require('tone');
const logo = require('./logo.svg'); 

// tslint:disable-next-line:no-unused-expression

var drumCompress = new Tone.Compressor({
  'threshold' : -30,
  'ratio' : 6,
  'attack' : 0.3,
  'release' : 0.1
}).toMaster();
var distortion = new Tone.Distortion({
  'distortion' : 0.2,
  'wet' : 0.1
});

var kick = new Tone.MembraneSynth({
  'envelope' : {
    'sustain' : 0,
    'attack' : 0.02,
    'decay' : 0.8
  },
  'octaves' : 10
}).chain(drumCompress);
// tslint:disable-next-line:no-any
var kickPart = new Tone.Loop((time: any) => kick.triggerAttackRelease('C2', '8n', time), '2n');
kickPart.start(0);

var snare = new Tone.NoiseSynth({
  'volume' : -5,
  'envelope' : {
    'attack' : 0.001,
    'decay' : 0.2,
    'sustain' : 0
  },
  'filterEnvelope' : {
    'attack' : 0.001,
    'decay' : 0.1,
    'sustain' : 0
  }
}).chain(distortion, drumCompress);
// tslint:disable-next-line:no-any
var snarePart = new Tone.Loop((time: any) => snare.triggerAttack(time), '2n');
snarePart.start('4n');

Tone.Transport.start('+1');
// Tone.Transport.loop = true;
// Tone.Transport.loopStart = 0;
// Tone.Transport.loopEnd = 4;

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
        <Controls playState={PlayerState.Playing}/>
        
      </div>
    );
  }
}

export default App;
