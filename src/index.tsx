import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import * as Tone from 'tone';

// tslint:disable-next-line:no-any
(localStorage as any).debug = 'AudioGraph';

var polySynth = new Tone.PolySynth(4, () => new Tone.Synth());
polySynth.toMaster();
Tone.Transport.start('+0.1');
polySynth.triggerAttackRelease('C2', '8n', '@1m', 2);

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
