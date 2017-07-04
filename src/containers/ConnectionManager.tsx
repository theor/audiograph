import { State as ConnectionState } from '../components/Connection';
import { SoundManager } from '../containers/Sound';
import Peer = require('peerjs');

import * as Debug from 'debug';

import { InstrumentId, MessageType, Message } from '../containers/BaseTypes';
import * as Core from '../containers/BaseTypes';
import * as Tone from 'tone';
var debug = Debug('AudioGraph:Connection');

abstract class BaseConnection {
    public state: ConnectionState;
    protected peer: Peer;

    constructor(protected update: (() => void)) {
        this.state = { kind: 'none' };
    }

    disconnect() {
        this.peer.disconnect();
        this.state = { kind: 'none' };
        this.update();
    }
    
    public get isConnected(): boolean {
        return this.state
            ? (this.state.kind === 'client' || this.state.kind === 'host')
            : false;
    }

    public get isConnecting(): boolean {
        return this.state ? this.state.kind === 'connecting' : false;
    }
}

export type ConnectionManager = ConnectionHost | ConnectionClient;

export class ConnectionHost extends BaseConnection {
    private clients: Map<string, Peer.DataConnection>;
    
    host() {
        debug('host');
        this.clients = new Map();
        this.peer = new Peer({ debug: 3, host: 'audiograph.herokuapp.com', port: 443, secure: true });
        this.state = { kind: 'connecting' };
        this.update();
        this.peer.on('connection', conn => {
            this.clients.set(conn.peer, conn);
            conn.on('close', () => this.clients.delete(conn.peer));
            conn.on('data', (data) => this.readMessageOnHost(conn, data));
        });
        this.peer.on('open', id => {
            this.state = { kind: 'host', id: id };
            this.update();
        });
        this.peer.on('disconnected', () => {
            this.state = { kind: 'none' };
            this.update();
        });
    }

    readMessageOnHost(conn: Peer.DataConnection, data: {}) {
        debug('host data: %s => %O', conn.peer, data);
        let m = data as Core.Message;
        if (!m || !m.v) {
            debug('host received data is not a Message');
            return;
        }

        switch (m.v.kind) {
            case 'addInstr':
                SoundManager.setInstrument(m.senderId, m.v.instr);
                break;
            case 'remInstr':
                debug('remInstr NIY');
                // SoundManager.setInstrument(m.senderId, m.v.instr);
                break;
            case 'sequence':
                {
                    let instr = SoundManager.getBandInstrument(m.senderId);
                    if (!instr) {
                        debug('could not find instr %s for message %O', m.senderId, m);
                        return;
                    }
                    let tInstr = instr as Core.InstrumentTyped<Core.MessageSequence>;
                    if (!tInstr) {
                        debug('wrong instrument type');
                        return;
                    }
                    tInstr.applyMessage(m.v);
                }
                break;
            case 'timed':
                {
                    let instr = SoundManager.getBandInstrument(m.senderId);
                    if (!instr) {
                        debug('could not find instr %s for message %O', m.senderId, m);
                        return;
                    }
                    let tInstr = instr as Core.InstrumentTyped<Core.MessageTimed>;
                    if (!tInstr) {
                        debug('wrong instrument type');
                        return;
                    }
                    tInstr.applyMessage(m.v);
                }
                break;
            default:
                debug('unknown message type: %O', m);
                break;
        }
    }
    
    syncAll() {
        let msg: Message = {
            v: { kind: 'sync', t: new Date().getTime() },
            senderId: this.peer.id
        };
        this.clients.forEach(conn => {
            conn.send(msg);
        });
    }

    sendAll() {
        this.clients.forEach(conn => {
            conn.send(SoundManager.state);
        });
    }
}
export class ConnectionClient extends BaseConnection {
    peer: Peer;
    state: ConnectionState;
    private connection: Peer.DataConnection;

    join(id: string) {
        debug(`join ${id}`);
        this.peer = new Peer({ debug: 3, host: 'audiograph.herokuapp.com', port: 443, secure: true });
        this.state = { kind: 'connecting' };
        this.update();
        this.connection = this.peer.connect(id);
        let self = this;
        this.connection.on('data', data => { this.readMessageOnClient(data); });
        this.connection.on('error', data => {
            debug('error: %O', data);
            this.state = { kind: 'none' };
            self.update();
        });
        this.connection.on('open', () => {
            this.state = { kind: 'client', id: this.peer.id, hostId: id };
            debug('open');
            self.update();
        });
        this.connection.on('close', () => {
            this.state = { kind: 'none' };
            debug('close');
            self.update();
        });
    }

    send(m: MessageType, senderId: string) {
        let msg: Message = {
            v: m,
            senderId
        };
        this.connection.send(msg);
    }

    // client
    sendAddInstrument(id: InstrumentId) {
        this.send({ kind: 'addInstr', instr: id }, this.peer.id);
    }

    sendRemoveInstrument(id: InstrumentId) {
        this.send({ kind: 'remInstr', instr: id }, this.peer.id);
    }

    readMessageOnClient(data: {}) {
        debug('data: %O', data);
        let m = data as Core.Message;
        if (!m || !m.v) {
            debug('client received data is not a Message');
            return;
        }
        if (m.v.kind === 'sync') {
            let now = new Date().getTime();
            let delta = now - m.v.t;
            let deltaSeconds = -delta / 1000.0;
            debug(`sync: start ${m.v.t} now ${now} delta ${delta} ds ${deltaSeconds}`);
            Tone.Transport.start(deltaSeconds);
        } else {
            debug(`unknown client message: ${m.v.kind}`);
            return;
        }
    }
}