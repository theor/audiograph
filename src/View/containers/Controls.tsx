import { Controls, Props, PropsState, PropsDispatch } from '../components/Controls';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';
import {Action as ReduxAction} from 'redux';

export function mapStateToProps({state, volume, start, stop}: StoreState): PropsState {
  return {
    playState: state,
    volume
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>): PropsDispatch {
  return {
    start: () => dispatch(actions.Play()),
    stop: () => dispatch(actions.Stop()),
  };
}

export default connect<{}, {}, Props>(mapStateToProps, mapDispatchToProps)(Controls);