import * as Core from '../../containers/BaseTypes';

import * as Tone from 'tone';
import * as React from 'react';
import { NexusUICanvas, NxWidget, NxMatrix } from '../../NexusUICanvas';
import * as Debug from 'debug';
var debug = Debug('AudioGraph.Sound');

abstract class Timed extends Core.InstrumentTyped<Core.MessageTimed> {
    applyMessage(m: Core.MessageTimed) {
        debug('apply %O %i', m, this);
        this.playNote(m.note, '+0.1');
        // this.partition = m.notes;
    }
    
    mount(): void {
        debug('mount %s', this.id);
    }
    
    unmount(): void {

    }

    protected abstract playNote(note: string, time: Tone.Time): void;
}

export class Osc extends Timed {
    synth: Tone.MonoSynth;
    mount(): void {
        super.mount();
        this.synth = new Tone.MonoSynth({
			"portamento" : 0.01,
			"oscillator" : {
				"type" : "square"
			},
			"envelope" : {
				"attack" : 0.005,
				"decay" : 0.2,
				"sustain" : 0.4,
				"release" : 1.4,
			},
			"filterEnvelope" : {
				"attack" : 0.005,
				"decay" : 0.1,
				"sustain" : 0.05,
				"release" : 0.8,
				"baseFrequency" : 300,
				"octaves" : 4
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
        (w as any).mode = 'matrix';
        w.on('*', data => {
            if((w as any).clicked) {
                this.send({ kind: 'timed', note: 'C4' });
            }
        });
    }
}

abstract class Sequencer extends Core.InstrumentTyped<Core.MessageSequence> {
    protected readonly times: number = 16;
    protected partition: Tone.Note[][];
    protected abstract get noteNames(): string[];
    private part: Tone.Loop;
    protected abstract playNote(note: string, time: Tone.Time): void;
    
    applyMessage(m: Core.MessageSequence) {
        debug('apply %O %i', m, this.times);
        this.partition = m.notes;
    }
    
    mount(): void {
        debug('mount %s', this.id);
        
        let indices = [];
        for (var index = 0; index < this.times; index++) { indices.push(index); }
        this.part = new Tone.Sequence(
            (time: Tone.Time, col: number) => {
                if (!this.partition) {
                    return;
                }
                var column = this.partition[col];
                if(!column) {
                    return;
                }

                for (var i = 0; i < column.length; i++) {
                        // slightly randomized velocities
                        this.playNote(column[i], time);
                }
            }, indices, `${this.times}n`
        );

        this.part.start(0);
    }
    
    unmount(): void {
        debug('unmount %s', this.id);
        this.part.stop()
    }

    createUI(): JSX.Element {
        return (
            <NexusUICanvas type="matrix" initWidget={(w) => this.setup(w)} />
        );
    }

    private setup(w: NxWidget) {
        let m = w as NxMatrix;
        m.col = this.times;
        m.row = this.noteNames.length;
        m.init();
        m.resize(350, 300);
        m.draw();
        if (!m) {
            debug('not a matrix');
            return;
        }
        // this.matrix = m;
        m.on('*', data => {
            debug('matrix: %O %O', data, m.matrix);
            let notes: Tone.Note[][] = [];
            for (var c = 0; c < this.times; c++) {
                let column = m.matrix[c];
                let colNotes: Tone.Note[] = [];
                for (var i = 0; i < 4; i++) {
                    if (column[i] === 1) {
                        colNotes.push(this.noteNames[i]);
                    }
                }
                notes.push(colNotes);
            }
            this.send({ kind: 'sequence', notes: notes, subdivision: `${this.times}n` });
        });
    }
}

export class Drums extends Sequencer {
    // createUI(): JSX.Element { return <br/> }
    private player: Tone.MultiPlayer;
    private mapping = {
        'kick': './audio/505/kick.mp3',
        'snare': './audio/505/snare.mp3',
        'hh': './audio/505/hh.mp3',
    }

    protected get noteNames() { return Object.keys(this.mapping); }

    protected playNote(note: string, time: Tone.Time) { 
        this.player.start(note, time);
    }

    mount(): void {
        this.player = new Tone.MultiPlayer({urls: this.mapping});
        this.player.toMaster();
        super.mount();
    }
}
export class Drums2 extends Sequencer {
    private polySynth: Tone.PolySynth;

    protected get noteNames() { return ['F4', 'E4', 'C4', 'A4']; }

    protected playNote(note: string, time: Tone.Time) { 
                        var vel = Math.random() * 0.5 + 0.5;
                        this.polySynth.triggerAttackRelease(note, '32n', time, vel);
    }

    mount(): void {
        this.polySynth = new Tone.PolySynth(4, () => new Tone.Synth());
        this.polySynth.toMaster();
        super.mount();
    }
}