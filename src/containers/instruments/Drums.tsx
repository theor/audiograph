import * as Core from '../../containers/BaseTypes';

import * as Tone from 'tone';
import * as React from 'react';
import { NexusUICanvas, NxWidget, NxMatrix } from '../../NexusUICanvas';
import * as Debug from 'debug';
var debug = Debug('AudioGraph.Sound');

export class Drums extends Core.InstrumentTyped<Core.MessageSequence> {
    // createUI(): JSX.Element { return <br/> }
    applyMessage(m: Core.MessageSequence) { debug('apply'); }
    mount(): void { debug('mount'); }
    unmount(): void { debug('unmount'); }
}
export class Drums2 extends Core.InstrumentTyped<Core.MessageSequence> {
    private part: Tone.Loop;
    private partition: Tone.Note[][];
    private noteNames = ['F4', 'E4', 'C4', 'A4'];
    private readonly times: number = 16;

    applyMessage(m: Core.MessageSequence) {
        debug('apply %O %i', m, this.times);
        this.partition = m.notes;
    }
    
    mount(): void {
        debug('mount %s', this.id);
        var polySynth = new Tone.PolySynth(4, () => new Tone.Synth());
        polySynth.toMaster();
        let indices = [];
        for (var index = 0; index < this.times; index++) { indices.push(index); }
        this.part = new Tone.Sequence(
            (time: Tone.Time, col: number) => {
                console.log(col);
                if (!this.partition) {
                    return;
                }
                var column = this.partition[col];
                if(!column) {
                    return;
                }

                for (var i = 0; i < column.length; i++) {
                        // slightly randomized velocities
                        var vel = Math.random() * 0.5 + 0.5;
                        polySynth.triggerAttackRelease(column[i], '32n', time, vel);
                }
            }, indices, `${this.times}n`
        );
        // this.part = new Tone.Sequence(
        //     (t: Tone.Time, n: number) => {
        //         polySynth.triggerAttackRelease(n, '8n', t);
        //     },
        //     ['C2', 'E2', 'C2', 'E2'], '4n');

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
        m.init();
        m.resize(400, 400);
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