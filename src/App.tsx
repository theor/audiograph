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
import { ConnectionManager } from './containers/ConnectionManager';
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
  conn: ConnectionManager;
}
class JoinPage extends React.Component<JoinProps, null> {
  componentWillMount() {
    let id = this.props.match.params.id;
    if (this.props.conn.state.kind === 'none') {
      this.props.conn.join(id);
    }
  }

  render() {
    let id = this.props.match.params.id;

    var x: JSX.Element;
    switch (this.props.conn.state.kind) {
      case 'connecting':
        x = <span>Connecting...</span>;
        break;
      case 'client':
        x = (
          <div>
            <button onClick={() => this.props.conn.disconnect()}>Disconnect</button>
            <span>{id}</span>
            {/*<button onClick={() => this.props.conn.send({})}>Send</button>*/}
            <Workspace conn={this.props.conn} />
          </div>
        );

        break;
      default:
        x = <span>Unknown state: {this.props.conn.state.kind}</span>;
        break;
    }

    return (
      <div>
        <TransportComponent forceUpdate={() => this.forceUpdate()}/>
        {x}
      </div>
    );
  }
}

class App extends React.Component<{}, ConnectionManager> {

  constructor(props: {}) {
    super(props);
    this.state = new ConnectionManager(() => this.forceUpdate());

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
          <Route path="/join/:id" component={this.joinPage} />
          <Route exact={true} path="/" component={this.hostPage} />
        </div>
      </Router>
    );
  }

  private joinPage: React.SFC<JoinProps> = (props: JoinProps) => <JoinPage conn={this.state} {...props} />;
  private hostPage: React.SFC<HostProps> = (props: HostProps) => {
    let x = this.state.isConnected
      ? displayConnected(this.state)
      : <button onClick={() => this.state.host()}>Host</button>;

    return (
      <div>
        {x}
        <p>HOST {JSON.stringify(props)}</p>
        <TransportComponent forceUpdate={() => this.forceUpdate()} conn={this.state}/>
      </div>
    );
  }
}

function displayConnected(state: Readonly<ConnectionManager>): JSX.Element {
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
