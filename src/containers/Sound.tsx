import * as Tone from 'tone';
import * as React from 'react';
import * as Debug from 'debug';
var debug = Debug('AudioGraph.Sound');

type InstrumentId = string;

type InstrumentCreator = () => Instrument;

export interface Instrument { }

export abstract class InstrumentTyped<T extends MessageBase> implements Instrument {
    createUI(): JSX.Element { return <span>Unknown Instrument</span>}
    abstract applyMessage(m: T): void;
    abstract mount(): void;
    abstract unmount(): void;
}

// interface Message<T> { value: T; }

interface MessageBase { }
interface MessageSequence extends MessageBase { kind: 'sequence' }
export interface MessageTimedSequence extends MessageBase { kind: 'timed' }
type MessageType = MessageSequence | MessageTimedSequence

class Drums extends InstrumentTyped<MessageSequence> {
    // createUI(): JSX.Element { return <br/> }
    applyMessage(m: MessageSequence) { };
    mount(): void { }
    unmount(): void { }
}
class Drums2 extends InstrumentTyped<MessageSequence> {
    createUI(): JSX.Element { return super.createUI(); }
    
    applyMessage(m: MessageSequence) { };
    mount(): void { }
    unmount(): void { }
}

export var SoundManager = new class {
    library: Map<InstrumentId, InstrumentCreator>;
    band: Map<string, Instrument>;
    constructor() {
        this.library = new Map();
        this.library.set('drums', () => new Drums());
        this.library.set('drums2', () => new Drums2());
        this.band = new Map();
    }
    playPause() {
        switch (Tone.Transport.state) {
            case 'started':
                Tone.Transport.pause(Tone.now()); break;
            default:
                Tone.Transport.start('+0.1'); break;
        }
    }
    state(): Tone.TransportState { return Tone.Transport.state; }

    getInstrument(id: InstrumentId): Instrument {
        return this.library[id];
    }

    pickInstrument(peer: string, instrId: InstrumentId) {
        let prev = this.band.get(peer);
        if (prev) {
            // unmount instrument
        }

        this.band.set(peer, instrId);
        let instr = this.getInstrument(instrId);
        debug('picked instr: %O', instr);
    }

    private applyMessageInstrument<T extends MessageType>(m: T, i: Instrument) {
        if (!i || !(i as InstrumentTyped<T>)) {
            debug('null instr');
            return;
        }

        if (!m || !(m as T)) {
            debug('null m');
            return;
        }
        
        (i as InstrumentTyped<T>).applyMessage(m);
    }

    applyMessage(m: MessageType, peerId: string) {
        let instr = this.band.get(peerId);
        if (!instr) {
            debug('No instrument for peer "%s"', peerId);
            return;
        }

        switch (m.kind) {
            case 'sequence':
                return this.applyMessageInstrument<MessageSequence>(m, instr);
            case 'timed':
                return this.applyMessageInstrument<MessageTimedSequence>(m, instr);
            default: debug('Error');
                break;
        }

    }
}

export const TransportComponent: React.SFC<{}> = (p: {}) => {
    return (
        <div>
            <span>state: {Tone.Transport.state}</span>
            <button onClick={() => SoundManager.playPause()}>
                {SoundManager.state() === 'started' ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};