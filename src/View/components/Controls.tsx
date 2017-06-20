import * as React from 'react';
import {PlayerState} from '../types/index';
import * as Tone from 'tone';

export interface PropsState {
  volume?: number;
  playState: PlayerState;
}

export interface PropsDispatch {
  start?: () => void;
  stop?: () => void;
}
export interface Props extends PropsState, PropsDispatch { }

export class Controls extends React.Component<Props, {}> {
  private interval: number;
  label(s: PlayerState) { return s === PlayerState.Playing ? 'stop' : 'start'; }
  start() {
    if(this.props.start)
      this.props.start();
    this.interval = requestAnimationFrame(() => this.progress());
  }
  stop() {
    if(this.props.stop)
      this.props.stop();
    if(this.interval)
      cancelAnimationFrame(this.interval);
  }
  progress(){
    this.forceUpdate();
    this.interval = requestAnimationFrame(() => this.progress());
  }
  
	componentDidMount() {
    this.interval = requestAnimationFrame(() => this.progress());
	}
  render() {
    let time = Tone.Transport.seconds.toFixed(2);
    
    return (
      <div className="hello">
        <div className="greeting">
          <button onClick={() => this.props.playState === PlayerState.Playing ? this.stop() : this.start()}>
            {this.label(this.props.playState)}
          </button>
          <span>{time}</span>
        </div>
      </div>
    );
  }
}

// export function Controls({ volume, playState, start, stop }: Props) {
//   let label = (s: PlayerState) => s === PlayerState.Playing ? 'stop' : 'start';
  
//   let time = Tone.Transport.seconds.toFixed(2);

//   return (
//     <div className="hello">
//       <div className="greeting">
//         <button onClick={playState === PlayerState.Playing ? stop : start}>{label(playState)}</button>
//         <span>{time}</span>
//       </div>
//     </div>
//   );
// }

// export default Controls;

// helpers