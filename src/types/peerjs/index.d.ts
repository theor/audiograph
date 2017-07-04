// Type definitions for PeerJS
// Project: http://peerjs.com/
// Definitions by: Toshiya Nakakura <https://github.com/nakakura>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


 interface Peer{
        /**
         *
         * @param id The brokering ID of the remote peer (their peer.id).
         * @param options for specifying details about Peer Connection
         */
        connect(id: string, options?: Peer.PeerConnectOption): Peer.DataConnection;
        /**
         * Connects to the remote peer specified by id and returns a data connection.
         * @param id The brokering ID of the remote peer (their peer.id).
         * @param stream The caller's media stream
         * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
         */
        call(id: string, stream: any, options?: any): Peer.MediaConnection;
        /**
         * Calls the remote peer specified by id and returns a media connection.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: string, cb: ()=>void): void;
        /**
         * Emitted when a connection to the PeerServer is established.
         * @param event Event name
         * @param cb id is the brokering ID of the peer
         */
        on(event: 'open', cb: (id: string)=>void): void;
        /**
         * Emitted when a new data connection is established from a remote peer.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'connection', cb: (dataConnection: Peer.DataConnection)=>void): void;
        /**
         * Emitted when a remote peer attempts to call you.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'call', cb: (mediaConnection: Peer.MediaConnection)=>void): void;
        /**
         * Emitted when the peer is destroyed and can no longer accept or create any new connections.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'close', cb: ()=>void): void;
        /**
         * Emitted when the peer is disconnected from the signalling server
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'disconnected', cb: ()=>void): void;
        /**
         * Errors on the peer are almost always fatal and will destroy the peer.
         * @param event Event name
         * @param cb Callback Function
         */
        on(event: 'error', cb: (err: any)=>void): void;
        /**
         * Remove event listeners.(EventEmitter3)
         * @param {String} event The event we want to remove.
         * @param {Function} fn The listener that we need to find.
         * @param {Boolean} once Only remove once listeners.
         */
        off(event: string, fn: Function, once?: boolean): void;
        /**
         * Close the connection to the server, leaving all existing data and media connections intact.
         */
        disconnect(): void;
        /**
         * Attempt to reconnect to the server with the peer's old ID
         */
        reconnect(): void;
        /**
         * Close the connection to the server and terminate all existing connections.
         */
        destroy(): void;

        /**
         * Retrieve a data/media connection for this peer.
         * @param peer
         * @param id
         */
        getConnection(peer: Peer, id: string): any;

        /**
         * Get a list of available peer IDs
         * @param callback
         */
        listAllPeers(callback: (peerIds: Array<string>)=>void): void;
        /**
         * The brokering ID of this peer
         */
        id: string;
        /**
         * A hash of all connections associated with this peer, keyed by the remote peer's ID.
         */
        connections: any;
        /**
         * false if there is an active connection to the PeerServer.
         */
        disconnected: boolean;
        /**
         * true if this peer and all of its connections can no longer be used.
         */
        destroyed: boolean;
    }

declare var Peer: {
    new (options: Peer.PeerJSOption): Peer;
    new (id: string, options?: Peer.PeerJSOption): Peer;
}
// export = PeerJs;
export = Peer;

declare namespace Peer {
// declare module PeerJs {

type EventHandler = (event: Event) => void;

type RTCPeerConnectionConfig = RTCConfiguration;

// https://www.w3.org/TR/webrtc/#idl-def-rtcdatachannelinit
interface RTCDataChannelInit {
    ordered?: boolean; // default = true
    maxPacketLifeTime?: number;
    maxRetransmits?: number;
    protocol?: string; // default = ''
    negotiated?: boolean; // default = false
    id?: number;
}

// https://www.w3.org/TR/webrtc/#idl-def-rtcdatachannelstate
type RTCDataChannelState = 'connecting' | 'open' | 'closing' | 'closed';

// https://www.w3.org/TR/websockets/#dom-websocket-binarytype
type RTCBinaryType = 'blob' | 'arraybuffer';

interface RTCDataChannel extends EventTarget {
    readonly label: string;
    readonly ordered: boolean;
    readonly maxPacketLifeTime: number | null;
    readonly maxRetransmits: number | null;
    readonly protocol: string;
    readonly negotiated: boolean;
    readonly id: number;
    readonly readyState: RTCDataChannelState;
    readonly bufferedAmount: number;
    bufferedAmountLowThreshold: number;
    binaryType: RTCBinaryType;

    close(): void;
    send(data: string | Blob | ArrayBuffer | ArrayBufferView): void;

    onopen: EventHandler;
    onmessage: (event: MessageEvent) => void;
    onbufferedamountlow: EventHandler;
    onerror: (event: ErrorEvent) => void;
    onclose: EventHandler;
}

// namespace PeerJs{
    interface PeerJSOption{
        key?: string;
        host?: string;
        port?: number;
        path?: string;
        secure?: boolean;
        config?: RTCPeerConnectionConfig;
        debug?: number;
    }

    interface PeerConnectOption{
        label?: string;
        metadata?: any;
        serialization?: string;
        reliable?: boolean;

    }

    interface DataConnection{
        send(data: any): void;
        close(): void;
        on(event: string, cb: ()=>void): void;
        on(event: 'data', cb: (data: any)=>void): void;
        on(event: 'open', cb: ()=>void): void;
        on(event: 'close', cb: ()=>void): void;
        on(event: 'error', cb: (err: any)=>void): void;
        off(event: string, fn: Function, once?: boolean): void;
        dataChannel: RTCDataChannel;
        label: string;
        metadata: any;
        open: boolean;
        peerConnection: any;
        peer: string;
        reliable: boolean;
        serialization: string;
        type: string;
        buffSize: number;
    }

    interface MediaConnection{
        answer(stream?: any): void;
        close(): void;
        on(event: string, cb: ()=>void): void;
        on(event: 'stream', cb: (stream: any)=>void): void;
        on(event: 'close', cb: ()=>void): void;
        on(event: 'error', cb: (err: any)=>void): void;
        off(event: string, fn: Function, once?: boolean): void;
        open: boolean;
        metadata: any;
        peer: string;
        type: string;
    }

    interface utilSupportsObj {
        audioVideo: boolean;
        data: boolean;
        binary: boolean;
        reliable: boolean;
    }

    interface util{
        browser: string;
        supports: utilSupportsObj;
    }

   
}

// var Peer: PeerJs.Peer: {
//     prototype: RTCIceServer;
//     /**
//      * A peer can connect to other peers and listen for connections.
//      * @param id Other peers can connect to this peer using the provided ID.
//      *     If no ID is given, one will be generated by the brokering server.
//      * @param options for specifying details about PeerServer
//      */
//     new (id: string, options?: PeerJs.PeerJSOption): PeerJs.Peer;

//     /**
//      * A peer can connect to other peers and listen for connections.
//      * @param options for specifying details about PeerServer
//      */
//     new (options: PeerJs.PeerJSOption): PeerJs.Peer;
// };

// }