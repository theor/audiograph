import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();
 
// Specify payload shape as generic type argument. 
export const Play = actionCreator('PLAY');
export const Stop = actionCreator('STOP');
