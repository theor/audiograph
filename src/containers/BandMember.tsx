
import * as Core from './BaseTypes';
import { ConnectionClient } from './ConnectionManager';
import { SoundManager } from './Sound';

import * as Debug from 'debug';
var debug = Debug('AudioGraph.Sound');

export var BandMember = new class {
    private instruments: Core.Instrument[] = [];
    get activeInstruments(): Readonly<Core.Instrument[]> { return this.instruments; }

    addInstrument(id: Core.InstrumentId, conn: Readonly<ConnectionClient>) {
        let instr = SoundManager.getInstrument(id, conn);
        this.instruments.push(instr);
        conn.sendAddInstrument(id);
        // send mount message
    }

    removeInstrument(id: Core.InstrumentId, conn: Readonly<ConnectionClient>) {
        let i = this.instruments.findIndex(x => x.id === id);
        if (i === -1) {
            debug('Could not remove not added instrument: %s', id);
            return;
        }
        this.instruments.splice(i, 1);
        conn.sendRemoveInstrument(id);
    }
};