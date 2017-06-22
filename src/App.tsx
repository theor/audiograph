import * as React from 'react';
import './App.css';
import { Connection, State as ConnectionState } from './components/Connection';
import { NexusUICanvas, NxWidget } from './NexusUICanvas';
import Peer = require('peerjs');

import * as Debug from 'debug';
var debug = Debug('AudioGraph');



// var host = new Peer({ key: 'ovdtdu9kq9i19k9', debug: 3 });
// var hostId: string = "";
// host.on('open', id => {
//   debug('host id: %O', id); hostId = id;

//   host.on('connection', dc => {
//     debug('host connection %O', dc);
//     dc.on('open', () => {
//       debug('host open');
//       dc.on('data', data => { debug('host data: %O', data); });
//       dc.send('host');
//     });
//   });

//   var client = new Peer({ key: 'ovdtdu9kq9i19k9', debug: 3 });
//   client.on('open', id => debug('client id: %O', id));
//   var dcc = client.connect(hostId);
//   dcc.on('data', data => debug('client data %O', data));
//   dcc.send("test");

// });




const logo = require('./logo.svg');

nx.skin('light-blue');
nx.sendsTo(function (d) { debug(this, d) });

class ConnectionManager {
  public state: ConnectionState;

  host() {
    debug("host");
    var peer = new Peer({ key: 'ovdtdu9kq9i19k9', debug: 3 });
    this.state = { kind: 'connecting' };
    peer.on('open', id => {
      this.state = { kind: 'host', id: id };
    });
  }

  constructor() {
    this.state = { kind: 'none' };
  }
}

class App extends React.Component<{}, null> {
  conn: ConnectionManager;
  constructor(props: {}) {
    super(props);
    this.conn = new ConnectionManager();
  }

  componentDidMount() {
    nx.add('dial', { name: "asd" });
  }

  render() {
    let dial1 = (w: NxWidget) => {
      // w.on('*', function(d:any) {debug(this.type, this.canvasID, d);});
    };
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
          <Connection state={this.conn.state} onHost={() => this.conn.host()} />
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <NexusUICanvas type='dial' initWidget={dial1} />
        <NexusUICanvas type='string' initWidget={dial1} />
        <NexusUICanvas type='button' initWidget={dial1} />
      </div>

    );
  }
}

export default App;
