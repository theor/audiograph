import * as React from 'react';

import {
  HashRouter as Router,
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
import * as RB from 'react-bootstrap-typescript';

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
        <TransportComponent forceUpdate={() => this.forceUpdate()} />
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
        <TransportComponent forceUpdate={() => this.forceUpdate()} conn={this.state} />
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

          <RB.Navbar inverse toggleButton bsStyle="default" className="navbar-default">
            <RB.Navbar.Toggle />
            <RB.Navbar.Header>
              <RB.Navbar.Brand>
                <a href="#">AudioGraph</a>
              </RB.Navbar.Brand>
            </RB.Navbar.Header>
            <RB.Navbar.Collapse>
              <RB.Nav>
                <RB.NavItem eventKey={1} href="#">Link</RB.NavItem>
                <RB.NavItem eventKey={2} href="#">Link</RB.NavItem>
                <RB.NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                  <RB.MenuItem eventKey={3.1}>Action</RB.MenuItem>
                  <RB.MenuItem eventKey={3.2}>Another action</RB.MenuItem>
                  <RB.MenuItem eventKey={3.3}>Something else here</RB.MenuItem>
                  <RB.MenuItem divider />
                  <RB.MenuItem eventKey={3.3}>Separated link</RB.MenuItem>
                </RB.NavDropdown>
              </RB.Nav>
              <RB.Nav pullRight>
                <RB.NavItem eventKey={1} href="#">Link Right</RB.NavItem>
                <RB.NavItem eventKey={2} href="#">Link Right</RB.NavItem>
              </RB.Nav>
            </RB.Navbar.Collapse>
          </RB.Navbar>
          <div className="container">
            <Route path="/join/:id" component={JoinPage} />
            <Route exact={true} path="/" component={HostPage} />
          </div>
        </div>
      </Router>
    );
  }
}

function displayConnectedHost(state: Readonly<Conn.ConnectionHost>): JSX.Element {
  return (
    <div>
      <RB.Button bsStyle="primary" onClick={() => state.disconnect()}>Disconnect</RB.Button>
      <Link to={'/join/' + (state.state as Host).id}>Join session</Link>: {(state.state as Host).id}
      <RB.Button onClick={() => state.sendAll()}>Send all</RB.Button>
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
