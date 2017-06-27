import * as React from 'react';
import { ConnectionManager } from '../containers/ConnectionManager';
import { Client } from '../components/Connection';

import * as Debug from 'debug';
var debug = Debug('AudioGraph:Core');

export type InstrumentId = string;

export interface MessageBase { kind: string; }

export interface MessageSequence extends MessageBase { kind: 'sequence'; notes: Tone.Note[][]; subdivision: Tone.Time; }

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

export type InstrumentCreator = (conn: ConnectionManager | undefined) => Instrument;

export interface Instrument {
    id: InstrumentId;
    createUI(): JSX.Element;
    mount(): void;
    unmount(): void;
}

export abstract class InstrumentTyped<T extends MessageBase> implements Instrument {
    id: InstrumentId;
    protected conn: ConnectionManager | undefined;
    constructor(id: InstrumentId, conn: ConnectionManager | undefined) {
        this.id = id;
        this.conn = conn;
     }
    createUI(): JSX.Element { return <span>Unknown  {this.id}</span>; }
    abstract applyMessage(m: T): void;
    abstract mount(): void;
    abstract unmount(): void;
    
    send(m: T): void {
        let mm = m as any as MessageType;
        debug('double convert message: %O -> %O', m, mm);
        this.conn!.send(mm, (this.conn!.state as Client).id);
    }
}
export class BlankInstr extends InstrumentTyped<MessageSequence> {
    // createUI(): JSX.Element { return <br/> }
    applyMessage(m: MessageSequence) {}
    mount(): void {}
    unmount(): void {}
}