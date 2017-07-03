import * as React from 'react';
// import { NexusUICanvas } from '../NexusUICanvas';
import { SoundManager } from './Sound';
import { BandMember } from './BandMember';

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
                        if (this.state.current && this.state.current !== '-') {
                            BandMember.removeInstrument(this.state.current, this.props.conn);
                        }
                        let newValue = e.target.value;
                        this.setState({'current': newValue});
                        if (newValue !== '-') {
                            BandMember.addInstrument(newValue, this.props.conn);
                        }
                    }}
                >
                    <option>-</option>
                    {Array.from(SoundManager.library.keys()).map(v => <option key={v}>{v}</option>)}
                </select>
                {this.renderWorkspace()}
            </div>
        );
    }
    private renderOneInstrument(i: Instrument): JSX.Element {
        return (
            <div key={i.id} className="touchui">
                <p>{i.id}</p>

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