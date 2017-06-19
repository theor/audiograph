import * as React from 'react';
import {PlayerState} from '../types/index';

export interface PropsState {
  volume?: number;
  playState: PlayerState;
}

export interface PropsDispatch {
  start?: () => void;
  stop?: () => void;
}
export interface Props extends PropsState, PropsDispatch { }

export function Controls({ volume, playState, start, stop }: Props) {
  let label = (s: PlayerState) => s === PlayerState.Playing ? 'stop' : 'start';
  return (
    <div className="hello">
      <div className="greeting">
        <button onClick={playState === PlayerState.Playing ? stop : start}>{label(playState)}</button>
      </div>
    </div>
  );
}

// export default Controls;

// helpers