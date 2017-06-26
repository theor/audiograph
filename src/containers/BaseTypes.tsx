import * as React from 'react';

export type InstrumentId = string;

export interface MessageBase { }

export interface MessageSequence extends MessageBase { kind: 'sequence'; }

export interface MessageTimedSequence extends MessageBase { kind: 'timed'; }
export interface MessageAddInstrument extends MessageBase { kind: 'addInstr'; instr: InstrumentId; }
export interface MessageRemoveInstrument extends MessageBase { kind: 'remInstr'; instr: InstrumentId; }

export type MessageType =
    MessageSequence |
    MessageTimedSequence |
    MessageAddInstrument |
    MessageRemoveInstrument;

export interface Message {
    v: MessageType;
    /**
     * sender PEER id
     */
    senderId: string;
}

// instruments

export type InstrumentCreator = () => Instrument;

export interface Instrument {
    id: InstrumentId;
    mount(): void;
    unmount(): void;
}

export abstract class InstrumentTyped<T extends MessageBase> implements Instrument {
    id: InstrumentId;
    createUI(): JSX.Element { return <span>Unknown Instrument</span>; }
    abstract applyMessage(m: T): void;
    abstract mount(): void;
    abstract unmount(): void;
}
export class BlankInstr extends InstrumentTyped<MessageSequence> {
    // createUI(): JSX.Element { return <br/> }
    applyMessage(m: MessageSequence) {}
    mount(): void {}
    unmount(): void {}
}