import * as React from 'react';
// import { NexusUICanvas } from '../NexusUICanvas';
import { SoundManager, BandMember } from '../containers/Sound';

import { ConnectionManager } from '../containers/ConnectionManager';
import { Instrument } from '../containers/BaseTypes';

import * as Debug from 'debug';
var debug = Debug('AudioGraph:Workspace');

interface State {
    current?: string;
}

interface Props {
    conn: ConnectionManager;
}

export class Workspace extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {current: undefined};
        // this.setState({current: undefined});
    }
    render() {
        // let selectInstruments = (w:NxWidget) => {

        //     (w as any).choices = Array.from(SoundManager.library.keys());
        //     w.init();
        //     w.on('*', data => { 
        //         debug('select: %O', data);
        //      } );
        // };

        // let pickInstrument = (x) => { debug('change')};
        return (
            <div>
                {/*initWidget={dial1}*/}
                <select
                    value={this.state.current}
                    onChange={(e) => {
                        debug('%O: %s', e.target, e.target.value);
                        if (this.state.current) {
                            BandMember.removeInstrument(this.state.current, this.props.conn);
                        }
                        
                        this.setState({'current': e.target.value});
                        BandMember.addInstrument(e.target.value, this.props.conn);
                    }}
                >
                    {Array.from(SoundManager.library.keys()).map(v => <option key={v}>{v}</option>)}
                </select>
                {/*<NexusUICanvas type="dial" />*/}
                <span>Workspace</span>
                {this.renderWorkspace()}
            </div>
        );
    }
    private renderOneInstrument(i: Instrument) : JSX.Element {
        return (
            <div key={i.id}>
                <h2>{i.id}</h2>
                {i.createUI()}
            </div>
        );
    }
    private renderWorkspace(): JSX.Element {
        
        return (
            <div>
                {BandMember.activeInstruments.map(this.renderOneInstrument)}
            </div>
        );
    }
}