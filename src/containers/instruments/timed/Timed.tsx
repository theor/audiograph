import * as Core from '../../../containers/BaseTypes';

import * as Debug from 'debug';
var debug = Debug('AudioGraph.Sound');

export abstract class Timed extends Core.InstrumentTyped<Core.MessageTimed> {
    applyMessage(m: Core.MessageTimed) {
        debug('apply %O %i', m, this);
        this.playNote(m.note, '+0.1');
        // this.partition = m.notes;
    }
    
    mount(tone: Core.Tone): void {
        debug('mount %s', this.id);
    }
    
    unmount(): void {
        debug('unmount %s', this.id);
    }

    protected abstract playNote(note: string, time: Tone.Time): void;
}