import * as React from 'react';
import { NexusUICanvas } from '../NexusUICanvas';
import { SoundManager } from "../containers/Sound";

import * as Debug from 'debug';
var debug = Debug('Audiograph:Workspace');

export class Workspace extends React.Component<{},null> {
    
    render() {
        // let selectInstruments = (w:NxWidget) => {
            
        //     (w as any).choices = Array.from(SoundManager.library.keys());
        //     w.init();
        //     w.on('*', data => { 
        //         debug('select: %O', data);
        //      } );
        // };

        // let pickInstrument = () => { debug('change')};
        return (
            <div>
                {/*initWidget={dial1}*/}
                <select ref={x => {if(!x) return; x.onChange=()=>debug('', x, x.val)}}>
                    {Array.from(SoundManager.library.keys()).map(v => <option>{v}</option>)}
                </select>
                <NexusUICanvas type="dial"  />
                <span>Workspace</span>
            </div>
        );
    }
}