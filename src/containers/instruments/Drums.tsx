import * as Core from '../../containers/BaseTypes';

import * as Tone from 'tone';
import * as Debug from 'debug';
var debug = Debug('AudioGraph.Sound');

export class Drums extends Core.InstrumentTyped<Core.MessageSequence> {
    // createUI(): JSX.Element { return <br/> }
    applyMessage(m: Core.MessageSequence) { debug('apply'); }
    mount(): void { debug('mount'); }
    unmount(): void { debug('unmount'); }
}
export class Drums2 extends Core.InstrumentTyped<Core.MessageSequence> {
    createUI(): JSX.Element { return super.createUI(); }

    applyMessage(m: Core.MessageSequence) { debug('apply'); }
    mount(): void {
        debug('mount %s', this.id);
        var polySynth = new Tone.PolySynth(4, () => new Tone.Synth());
        polySynth.toMaster();
        let loop = new Tone.Part((t, n) => { polySynth.triggerAttackRelease(n, '8n', t); },
            [[0, 'C2'], ['0:1', 'C2'], ['0:2', 'E2'], ['0:3', 'F2']]);

        loop.start(0);
    }
    unmount(): void { debug('unmount %s', this.id); }
}