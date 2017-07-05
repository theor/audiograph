// import * as Core from '../../containers/BaseTypes';

// import * as Tone from 'tone';
// import * as Debug from 'debug';
import * as Core from '../../BaseTypes';
// var debug = Debug('AudioGraph.Sound');

import {Sequencer} from './Sequencer';

export class Drums extends Sequencer {
    // createUI(): JSX.Element { return <br/> }
    private player: Tone.MultiPlayer;
    private mapping = {
        'kick': './audio/505/kick.mp3',
        'snare': './audio/505/snare.mp3',
        'hh': './audio/505/hh.mp3',
    };

    protected get noteNames() { return Object.keys(this.mapping); }

    protected playNote(note: string, time: Tone.Time) { 
        // debug(this.player);
        this.player.start(note, time);
    }

    mount(tone: Core.Tone): void {
        this.player = new tone.MultiPlayer({urls: this.mapping});
        this.player.toMaster();
        super.mount(tone);
    }
}
export class Drums2 extends Sequencer {
    private polySynth: Tone.PolySynth;

    protected get noteNames() { return ['F4', 'E4', 'C4', 'A4']; }

    protected playNote(note: string, time: Tone.Time) { 
                        var vel = Math.random() * 0.5 + 0.5;
                        this.polySynth.triggerAttackRelease(note, '32n', time, vel);
    }

    mount(tone: Core.Tone): void {
        this.polySynth = new tone.PolySynth(4, () => new tone.Synth());
        this.polySynth.toMaster();
        super.mount(tone);
    }
}