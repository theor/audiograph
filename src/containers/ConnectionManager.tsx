import { State as ConnectionState } from '../components/Connection';
import { SoundManager } from '../containers/Sound';
import Peer = require('peerjs');

import * as Debug from 'debug';
var debug = Debug('AudioGraph.Connection');

export class ConnectionManager {
    public state: ConnectionState;
    private peer: Peer;
    private connection: Peer.DataConnection;
    private clients: Map<string, Peer.DataConnection>;

    host() {
        debug('host');
        this.clients = new Map();
        this.peer = new Peer({ key: 'ovdtdu9kq9i19k9', debug: 3 });
        this.state = { kind: 'connecting' };
        this.update();
        this.peer.on('connection', conn => {
            this.clients.set(conn.peer, conn);
            conn.on('close', () => this.clients.delete(conn.peer));
            conn.on('data', data => {
                debug('data: %s => %O', conn.peer, data);
            });
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

    join(id: string) {
        debug(`join ${id}`);
        this.peer = new Peer({ key: 'ovdtdu9kq9i19k9', debug: 3 });
        this.state = { kind: 'connecting' };
        this.update();
        this.connection = this.peer.connect(id);
        let self = this;
        this.connection.on('data', data => {
            debug('data: %O', data);
        });
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

    sendAll() {
        this.clients.forEach(conn => {
            conn.send(SoundManager.state());
        });
    }

    send() {
        this.connection.send(SoundManager.state());
    }

    disconnect() {  
        this.peer.disconnect();
        this.update();
    }

    constructor(private update: (() => void)) {
        this.state = { kind: 'none' };
    }

    public get isConnected(): boolean {
        return this.state
            ? (this.state.kind === 'client' || this.state.kind === 'host')
            : false;
    }
    public get isConnecting(): boolean { return this.state ? this.state.kind === 'connecting' : false; }
}