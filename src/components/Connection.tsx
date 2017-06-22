import * as React from 'react';

interface None { kind: 'none' }
interface Connecting { kind: 'connecting' }
interface Host { kind: 'host', id: string; }
interface Client { kind: 'client', id: string; hostId: string; }
export type State = None | Connecting | Host | Client

interface ConnectionProps { 
    state: State;
    onHost: () => void;
}

export const Connection: React.SFC<ConnectionProps> = (props) => {
    // export class Connection extends React.Component<ConnectionProps, null> {

    let buttons = null;
    switch (props.state.kind) {
        case 'connecting':
            buttons = (<span>Connecting...</span>);
            break;
        case 'none':
            buttons = (
                <div>
                    <button onClick={props.onHost}>Host</button>
                    <button>Join</button>
                </div>
            );
            break;
        case 'host':
            buttons = (
                <button>Disconnect</button>
            );
            break;
        case 'client':
            buttons = (
                <button>Disconnect</button>
            );
            break;
    }
    return (
        <div>
            <span>Connection</span>
            <span>Status: {JSON.stringify(props.state)}</span>
            {buttons}
        </div>
    );
};