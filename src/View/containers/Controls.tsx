import Controls from '../components/Controls';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';
import {Action as ReduxAction} from 'redux';

export function mapStateToProps({ enthusiasmLevel, languageName }: StoreState) {
  return {
    enthusiasmLevel,
    name: languageName,
  }
}

export function mapDispatchToProps(dispatch: Dispatch<ReduxAction>) {
  return {
    start: () => dispatch(actions.IncrementEnthusiasm({})),
    stop: () => dispatch(actions.DecrementEnthusiasm()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);