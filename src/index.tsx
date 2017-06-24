import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import * as Tone from 'tone';

// tslint:disable-next-line:no-any
(localStorage as any).debug = 'AudioGraph,AudioGraph.*';

var polySynth = new Tone.PolySynth(4, () => new Tone.Synth());
polySynth.toMaster();
Tone.Transport.loopEnd = '1m';
Tone.Transport.loop = true;
let loop = new Tone.Part((t, n) => { polySynth.triggerAttackRelease(n, '8n', t); },
                         [[0, 'C2'], ['0:1', 'C2'], ['0:2', 'E2'], ['0:3', 'F2']]);

loop.start(0);
// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t), 2);
// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t, 2), '0:1');
// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t, 2), '0:2');
Tone.Transport.start('+0.1');

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
