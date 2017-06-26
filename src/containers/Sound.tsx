import * as Tone from 'tone';
import * as React from 'react';

(document as any).Tone2 = Tone;

import { ConnectionManager } from '../containers/ConnectionManager';
import * as Core from '../containers/BaseTypes';
import { InstrumentId } from '../containers/BaseTypes';

import * as Debug from 'debug';
import { Drums, Drums2 } from '../containers/instruments/Drums';
var debug = Debug('AudioGraph.Sound');

export var SoundManager = new class {
    library: Map<InstrumentId, Core.InstrumentCreator>;
    band: Map<string, Core.Instrument>;
    constructor() {
        this.library = new Map();
        this.library.set('drums', () => new Drums());
        this.library.set('drums2', () => new Drums2());
        this.band = new Map();
    }
    playPause(): Tone.TransportState {
        switch (Tone.Transport.state) {
            case 'started':
                Tone.Transport.stop(0); return 'stopped';
            default:
                Tone.Transport.start('+0.1'); return 'started';
        }
    }
    get state(): Tone.TransportState { return Tone.Transport.state; }


    getInstrument(id: InstrumentId): Core.Instrument {
        let instr = this.library.get(id);
        if (instr) {
            return instr();
        }
        debug('could not find instrument "%s"', id);
        return new Core.BlankInstr();
    }

    setInstrument(peer: string, instrId: InstrumentId) {
        let prev = this.band.get(peer);
        if (prev) {
            prev.unmount();
            // unmount instrument
        }

        let instr = this.getInstrument(instrId);

        this.band.set(peer, instr);
        debug('picked instr: %O', instr);
        instr.mount();
    }

    applyMessage(m: Core.MessageType, peerId: string) {
        let instr = this.band.get(peerId);
        if (!instr) {
            debug('No instrument for peer "%s"', peerId);
            return;
        }

        switch (m.kind) {
            case 'sequence':
                return this.applyMessageInstrument<Core.MessageSequence>(m, instr);
            case 'timed':
                return this.applyMessageInstrument<Core.MessageTimedSequence>(m, instr);
            default:
                debug('Error');
                break;
        }
    }

    private applyMessageInstrument<T extends Core.MessageType>(m: T, i: Core.Instrument) {
        if (!i || !(i as Core.InstrumentTyped<T>)) {
            debug('null instr');
            return;
        }

        if (!m || !(m as T)) {
            debug('null m');
            return;
        }

        (i as Core.InstrumentTyped<T>).applyMessage(m);
    }
};

export var BandMember = new class {
    private instruments: Core.Instrument[] = [];

    addInstrument(id: InstrumentId, conn: ConnectionManager) {
        let instr = SoundManager.getInstrument(id);
        this.instruments.push(instr);
        conn.sendAddInstrument(id);
        // send mount message
    }

    removeInstrument(id: InstrumentId, conn: ConnectionManager) {
        let i = this.instruments.findIndex(x => x.id === id);
        if (i === -1) {
            debug('Could not remove not added instrument: %s', id);
            return;
        }
        this.instruments.splice(i, 1);
        conn.sendRemoveInstrument(id);
    }
};

interface Props { forceUpdate: () => void; }
export class TransportComponent extends React.Component<Props, { t: Tone.TransportState }> {
    componentWillMount() {
        this.state = { t: SoundManager.state };
    }
    render() {
        debug('render Transport, %s', this.state.t);
        let onClick = () => {
            let newState = SoundManager.playPause();
            debug('setState Transport, %s', this.state.t,newState);
            this.setState({ t: newState });
        };
        return (
            <div>
                <span>state: {this.state.t}</span>
                <button onClick={onClick}>
                    {this.state.t === 'started' ? 'Pause' : 'Play'}
                </button>
            </div>
        );
    }
};