import * as Actions from '../actions';
let Tone = require('tone');

import {Action as ReduxAction} from 'redux';
// import {isType, Action} from 'redux-typescript-actions';

import { StoreState, PlayerState } from '../types/index';
// import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../constants/index';

export function enthusiasm(state: StoreState, action: ReduxAction): StoreState {
  switch (action.type) {
    case Actions.Play.type:
      Tone.Transport.start('+0.1');
      return { ...state, state: PlayerState.Playing };
    case Actions.Stop.type:
      Tone.Transport.stop();
      return { ...state, state: PlayerState.Stopped };
    default:
      if (String(action.type).startsWith('@@')) {
        return state;
      }
      throw action.type;
      // console.log(action.type);
    // case constants.DECREMENT_ENTHUSIASM:
    //   return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
  }
}