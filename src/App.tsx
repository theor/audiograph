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
nx.sendsTo(function (d: {}) { debug(this, d); });

interface HostProps extends RouteComponentProps<{}> {
  onHost: () => void;
}

type JoinProps = RouteComponentProps<{ id: string }>;

const JoinPage: React.SFC<JoinProps> = (props: JoinProps) => {
  return (
    <span>JOIN {props.match.params.id}</span>
  );
};

function displayConnected(state: Readonly<ConnectionManager>): JSX.Element {
  return (
    <div>
      <button onClick={() => state.disconnect()}>Disconnect</button>
      <Link to={'/join/' + (state.state as Host).id}>Join session</Link>
      <button onClick={() => state.disconnect()}>Disconnect</button>
    </div>
  );
}

class App extends React.Component<{}, ConnectionManager> {
  HostPage: React.SFC<HostProps> = (props: HostProps) => {
    let x = this.state.isConnected
      ? displayConnected(this.state)
      : <button onClick={() => this.state.host()}>Host</button>;

    return (
      <div>
        {x}
        <p>HOST {JSON.stringify(props)}</p>
      </div>
    );
  }

  constructor(props: {}) {
    super(props);
    this.state = new ConnectionManager(() => this.forceUpdate());
  }

  componentDidMount() {
    nx.add('dial', { name: 'asd' });
  }

  render() {
    // let dial1 = (w: NxWidget) => {
    //   // w.on('*', function(d:any) {debug(this.type, this.canvasID, d);});
    // };
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
            {/*<Connection
              state={this.state.state}
              onHost={() => this.state.host()}
              onDisconnect={() => this.state.disconnect()}
            />*/}
          </div>
          {/*<Route path="/join" component={JoinPage} />*/}
          <Route path="/join/:id" component={JoinPage} />
          <Route exact={true} path="/" component={this.HostPage} />
          {/*<NexusUICanvas type="dial" initWidget={dial1} />
        <NexusUICanvas type="string" initWidget={dial1} />
        <NexusUICanvas type="button" initWidget={dial1} />*/}
        </div>
      </Router>
    );
  }
}

export default App;
