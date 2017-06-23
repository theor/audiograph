import { State as ConnectionState } from '../components/Connection';
import Peer = require('peerjs');

import * as Debug from 'debug';
var debug = Debug('AudioGraph.Connection');

export class ConnectionManager {
  public state: ConnectionState;
  private peer: Peer;

  host() {
    debug('host');
    this.peer = new Peer({ key: 'ovdtdu9kq9i19k9', debug: 3 });
    this.state = { kind: 'connecting' };
    this.update();
    this.peer.on('open', id => {
      this.state = { kind: 'host', id: id };
      this.update();
    });
    this.peer.on('disconnected', () => {
      this.state = { kind: 'none' };
      this.update();
    });
  }

  disconnect() {
    this.peer.disconnect();
    this.update();
  }

  constructor(private update: (() => void)) {
    this.state = { kind: 'none' };
  }

  public get isConnected(): boolean { return this.state.kind === 'client' || this.state.kind === 'host'; }
}