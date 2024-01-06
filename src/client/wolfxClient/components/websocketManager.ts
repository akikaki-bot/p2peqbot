import {
    WebSocket
} from "ws"

import { EventEmitter } from "node:events"
import { WolflxParser } from "./wolfxParser";
import { IHeartbeat } from "./heartbeat";

export class WolfxManager extends EventEmitter {


    private ws : WebSocket;
    private sindo : string;

    constructor() {
        super()
        this.ws = new WebSocket("wss://ws-api.wolfx.jp/jma_eew");
        this.run()
    }

    private async run() {

        this.ws.on('open', () => this.emit('open', () => {}))
        this.ws.on('message', ( message : any ) => {
            const data = JSON.parse( message ) as WolflxParser | IHeartbeat ;
            data.type === "heartbeat" && this.emit('ping', JSON.parse( JSON.stringify( data )) as IHeartbeat )
            if( data.type === "jma_eew" ){

                const parsed = new WolflxParser( data )
                
                if( parsed.Serial === "1" ){
                    this.sindo = parsed.MaxIntensity
                    this.emit('eew', parsed)
                }
                if( this.sindo !== parsed.MaxIntensity) {
                    this.sindo = parsed.MaxIntensity;
                    this.emit('eew', parsed)
                }
                if( parsed.isFinal ) {
                    this.emit('eew', parsed)
                }
                
            }
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
    on(event : 'ping', listener : ( data : IHeartbeat ) => void ): this
}