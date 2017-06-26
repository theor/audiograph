import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import * as Tone from 'tone';
(document as any).Tone = Tone;

// tslint:disable-next-line:no-any
(localStorage as any).debug = 'AudioGraph,AudioGraph.*,AudioGraph:*';

// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t), 2);
// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t, 2), '0:1');
// Tone.Transport.schedule(t => polySynth.triggerAttackRelease('C2', '8n', t, 2), '0:2');
// Tone.Transport.start('+0.1');

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
