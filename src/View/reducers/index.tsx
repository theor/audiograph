import * as Actions from '../actions';

import {Action as ReduxAction} from 'redux';
// import {isType, Action} from 'redux-typescript-actions';

import { StoreState } from '../types/index';
// import { INCREMENT_ENTHUSIASM, DECREMENT_ENTHUSIASM } from '../constants/index';

export function enthusiasm(state: StoreState, action: ReduxAction): StoreState {
  switch (action.type) {
    case Actions.IncrementEnthusiasm.type:
      return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
    default:
      console.log(action.type);
      break;
    // case constants.DECREMENT_ENTHUSIASM:
    //   return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
  }
  return state;
}