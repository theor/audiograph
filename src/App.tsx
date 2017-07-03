import * as React from 'react';

import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Link
} from 'react-router-dom';

import './App.css';
// import Peer from 'peerjs';

import { Host } from './components/Connection';
import * as Conn from './containers/ConnectionManager';
import { TransportComponent } from './containers/Sound';
import { Workspace } from './containers/Workspace';

// import * as Debug from 'debug';
// var debug = Debug('AudioGraph');

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

// const logo = require('./logo.svg');

interface HostProps extends RouteComponentProps<{}> {
  onHost: () => void;
}

interface JoinProps extends RouteComponentProps<{ id: string }> {
}
class JoinPage extends React.Component<JoinProps, Conn.ConnectionClient> {
  componentWillMount() {
    this.state = new Conn.ConnectionClient(() => this.forceUpdate());
    let id = this.props.match.params.id;
    if (this.state.state.kind === 'none') {
      this.state.join(id);
    }
  }

  render() {
    let id = this.props.match.params.id;

    var x: JSX.Element;
    switch (this.state.state.kind) {
      case 'connecting':
        x = <span>Connecting...</span>;
        break;
      case 'client':
        x = (
          <div>
            <button onClick={() => this.state.disconnect()}>Disconnect</button>
            <span>JOIN {id} {this.state.state.kind}</span>
            {/*<button onClick={() => this.state.send({})}>Send</button>*/}
            <Workspace conn={this.state} />
          </div>
        );

        break;
      default:
        x = <span>Unknown state: {this.state.state.kind}</span>;
        break;
    }

    return (
      <div>
        {x}
      </div>
    );
  }
}

class HostPage extends React.Component<HostProps, Conn.ConnectionHost> {
  componentWillMount() {
    this.state = new Conn.ConnectionHost(() => this.forceUpdate());
  }
  render() { 
    let x = this.state.isConnected
      ? displayConnectedHost(this.state)
      : <button onClick={() => this.state.host()}>Host</button>;

    return (
      <div>
        {x}
        <p>HOST {JSON.stringify(this.props)}</p>
        <TransportComponent forceUpdate={() => this.forceUpdate()}/>
      </div>
    );
  }
}

class App extends React.Component<{}, Conn.ConnectionManager> {

  constructor(props: {}) {
    super(props);
    // this.state = new ConnectionManager(() => this.forceUpdate());

    nx.skin('light-blue');
    // nx.sendsTo(function (d: {}) { debug(this, d); });
  }

  componentDidMount() {
    // nx.add('dial', { name: 'asd' });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            {/*<img src={logo} className="App-logo" alt="logo" />*/}
            <h2>AudioGraph</h2>
          </div>
          <Route path="/join/:id" component={JoinPage} />
          <Route exact={true} path="/" component={HostPage} />
        </div>
      </Router>
    );
  }
}

function displayConnectedHost(state: Readonly<Conn.ConnectionHost>): JSX.Element {
  return (
    <div>
      <button onClick={() => state.disconnect()}>Disconnect</button>
      <Link to={'/join/' + (state.state as Host).id}>Join session</Link>: {(state.state as Host).id}
      <button onClick={() => state.sendAll()}>Send all</button>
    </div>
  );
}

// let dial1 = (w: NxWidget) => {
//   // w.on('*', function(d:any) {debug(this.type, this.canvasID, d);});
// };
/*<NexusUICanvas type="dial" initWidget={dial1} />
<NexusUICanvas type="string" initWidget={dial1} />
<NexusUICanvas type="button" initWidget={dial1} />*/

export default App;
