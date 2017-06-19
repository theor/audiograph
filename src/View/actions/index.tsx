import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();
 
// Specify payload shape as generic type argument. 
export const IncrementEnthusiasm = actionCreator<{}>('INCREMENT_ENTHUSIASM');
export const DecrementEnthusiasm = actionCreator('DECREMENT_ENTHUSIASM');
