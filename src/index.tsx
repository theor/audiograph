import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

interface DebugStorage { debug: string; }
let ds = localStorage as {} as DebugStorage;
ds!.debug = 'AudioGraph,AudioGraph.*,AudioGraph:*';
ds!.debug = '*';

// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t), 2);
// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t, 2), '0:1');
// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t, 2), '0:2');
// Tone.Transport.start('+0.1');

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
