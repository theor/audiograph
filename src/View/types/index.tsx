export enum PlayerState { Stopped, Playing }

export interface StoreState {
  state: PlayerState;
  volume: number;
  start?: () => void;
  stop?: () => void;
}