import * as Tone from 'tone';
import * as React from 'react';

var SoundManager = new class {
    playPause() {
        switch (Tone.Transport.state) {
            case 'started':
                Tone.Transport.pause(Tone.now()); break;
            default:
                Tone.Transport.start('+0.1'); break;
        }
    }
    state(): Tone.TransportState { return Tone.Transport.state; }
}

export const TransportComponent: React.SFC<{}> = (p: {}) => {
    return (
        <div>
            <span>state: {Tone.Transport.state}</span>
            <button onClick={() => SoundManager.playPause()}>
                {SoundManager.state() === 'started' ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};