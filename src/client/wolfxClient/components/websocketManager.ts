import {
    WebSocket
} from "ws"

import { EventEmitter } from "node:events"
import { WolflxParser } from "./wolfxParser";
import { IHeartbeat } from "./heartbeat";

export class WolfxManager extends EventEmitter {


    private ws : WebSocket;

    constructor() {
        super()
        this.ws = new WebSocket("wss://ws-api.wolfx.jp/jma_eew");
        this.run()
    }

    private async run() {

        this.ws.on('open', () => this.emit('open', () => {}))
        this.ws.on('message', ( message : any ) => {
            const data = JSON.parse( message ) as WolflxParser | IHeartbeat ;
            data.type === "jma_eew" && this.emit('eew', new WolflxParser(data));
        })
        this.ws.on('close', () => this.recconnect())
    }

    private async recconnect() {
        setTimeout(() => {
            this.ws = new WebSocket("ws://ws-api.wolfx.jp")
        }, 1000)
    }
}   

export interface WolfxManager {
    on(event : 'open', listener : () => void) : this
    on(event : 'eew', listener : ( data : WolflxParser ) => void) : this
}