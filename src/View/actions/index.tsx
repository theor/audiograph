import actionCreatorFactory from 'redux-typescript-actions';


export module constants {
export const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
export type INCREMENT_ENTHUSIASM = typeof INCREMENT_ENTHUSIASM;


export const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';
export type DECREMENT_ENTHUSIASM = typeof DECREMENT_ENTHUSIASM;
}

const actionCreator = actionCreatorFactory();
 
// Specify payload shape as generic type argument. 
export const IncrementEnthusiasm = actionCreator<{}>('INCREMENT_ENTHUSIASM');
export const DecrementEnthusiasm = actionCreator('DECREMENT_ENTHUSIASM');
