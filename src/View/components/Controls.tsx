import * as React from 'react';

export interface Props {
  volume: number;
  start?: () => void;
  stop?: () => void;
}

function Controls({ volume = 1, start, stop }: Props) {
  return (
    <div className="hello">
      <div className="greeting">

        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
      </div>
    </div>
  );
}

export default Controls;

// helpers