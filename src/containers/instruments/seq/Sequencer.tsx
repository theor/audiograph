import * as Core from '../../../containers/BaseTypes';

import * as Debug from 'debug';
var debug = Debug('AudioGraph.Sound');

import * as Tone from 'tone';
import * as React from 'react';
import { NexusUICanvas, NxWidget, NxMatrix } from '../../../NexusUICanvas';

export abstract class Sequencer extends Core.InstrumentTyped<Core.MessageSequence> {
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
                if (!column) {
                    return;
                }

                for (var i = 0; i < column.length; i++) {
                        // slightly randomized velocities
                        this.playNote(column[i], time);
                }
            },
            indices, `${this.times}n`
        );

        this.part.start(0);
    }
    
    unmount(): void {
        debug('unmount %s', this.id);
        this.part.stop();
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