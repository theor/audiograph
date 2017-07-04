import * as Tone from 'tone';
import * as React from 'react';

import { ConnectionClient, ConnectionHost } from './ConnectionManager';
import * as Core from './BaseTypes';
import { InstrumentId } from './BaseTypes';
import { Drums, Drums2, Osc } from './instruments';

import * as Debug from 'debug';
var debug = Debug('AudioGraph.Sound');

interface Newable {
    new (id: string, conn: Readonly<ConnectionClient> | undefined): Core.Instrument;
}

export var SoundManager = new class {
    library: Map<InstrumentId, Core.InstrumentCreator>;
    band: Map<string, Core.Instrument>;
    constructor() {
        this.library = new Map();
        let add = (id: string, t: Newable) => this.library.set(id, conn => new t(id, conn));
        add('TR808 Sequencer', Drums);
        add('Osc sequencer', Drums2);
        add('Free Osc', Osc);
        this.band = new Map();

        Tone.Transport.loopStart = 0;
        Tone.Transport.loopEnd = '1m';
        Tone.Transport.loop = true;
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

    getBandInstrument(peer: string): Core.Instrument | undefined {
        return this.band.get(peer);
    }

    getInstrument(id: InstrumentId, conn: Readonly<ConnectionClient> | undefined): Core.Instrument {
        let instr = this.library.get(id);
        if (instr) {
            return instr(conn);
        }
        debug('could not find instrument "%s"', id);
        return new Core.BlankInstr('blank', conn);
    }

    setInstrument(peer: string, instrId: InstrumentId) {
        let prev = this.band.get(peer);
        if (prev) {
            prev.unmount();
            // unmount instrument
        }

        let instr = this.getInstrument(instrId, undefined);

        this.band.set(peer, instr);
        debug('picked instr: %O for peer %s', instr, peer);
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
                return this.applyMessageInstrument<Core.MessageTimed>(m, instr);
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

interface Props { forceUpdate: () => void; conn?: Readonly<ConnectionHost>; }
export class TransportComponent extends React.Component<Props, { t: Tone.TransportState, time: number }> {
    componentWillMount() {
        this.state = { t: SoundManager.state, time: 0 };
        requestAnimationFrame(() => this.tick());
    }

    shouldComponentUpdate(nextProps: Props, nextState: { t: Tone.TransportState }) {
        // TODO: maybe optimize in case only props.canvasAttrs changes ...
        return true;
    }

    render() {
        // debug('render Transport, %s', this.state.t);
        let onClick = () => {
            let newState = SoundManager.playPause();
            // debug('setState Transport, %s', this.state.t, newState);
            this.setState({ t: newState });
            if (this.props.conn) {
                this.props.conn.syncAll();
            }
        };
        return (
            <div>
                {this.state.time.toFixed(2)} {Tone.Transport.bpm.value }
                <span>state: {this.state.t}</span>
                 {this.props.conn ?
                <button onClick={onClick}>
                    {this.state.t === 'started' ? 'Pause' : 'Play'}
                </button> : undefined}
            </div>
        );
    }

    tick() {
        this.setState({ t: this.state.t, time: Tone.Transport.seconds });
        requestAnimationFrame(() => this.tick());
    }
}