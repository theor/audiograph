import * as Core from '../../../containers/BaseTypes';

// import * as Debug from 'debug';
// var debug = Debug('AudioGraph.Sound');
import * as React from 'react';
import { NexusUICanvas, NxWidget, NxMatrix } from '../../../NexusUICanvas';

import { Timed } from './Timed';

export class Osc extends Timed {
    synth: Tone.MonoSynth;
    mount(tone: Core.Tone): void {
        super.mount(tone);
        this.synth = new tone.MonoSynth({
            'portamento' : 0.01,
            'oscillator' : {
                'type' : 'square'
            },
            'envelope' : {
                'attack' : 0.005,
                'decay' : 0.2,
                'sustain' : 0.4,
                'release' : 1.4,
            },
            'filterEnvelope' : {
                'attack' : 0.005,
                'decay' : 0.1,
                'sustain' : 0.05,
                'release' : 0.8,
                'baseFrequency' : 300,
                'octaves' : 4
            }
        });
        this.synth.toMaster();

    }
    
    protected playNote(note: string, time: Tone.Time): void {
        this.synth.triggerAttackRelease(note, '16n');
    }

    createUI(): JSX.Element {
        return (
            <NexusUICanvas type="multitouch" initWidget={(w) => this.setup(w)} />
        );
    }
    
    private setup(w: NxWidget) {
        (w as NxMatrix).mode = 'matrix';
        w.on('*', data => {
            if ((w as NxWidget).clicked) {
                this.send({ kind: 'timed', note: 'C4' });
            }
        });
    }
}
