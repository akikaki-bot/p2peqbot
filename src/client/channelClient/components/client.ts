
import { SendCategory } from "../../../utils/resolveSendCategory";
import * as Keyv from "keyv"

export class RegisterManager {

    private readonly JSONPath: string;
    private db : Keyv<any>

    constructor(JSONPath: string) {
        this.JSONPath = JSONPath;
        this.db = new Keyv(`sqlite://db/channels.dat`)
    }

    async register<T extends { type: SendCategory }>(gid: string, cid: string, datas: T): Promise<0 | 1> {
        const unStaticDBData = await this.db.get(`channels`)
        if(!unStaticDBData || typeof unStaticDBData === "undefined") {
            await this.db.set(`channels`, JSON.stringify([{ guildId : gid , datas : [{ channelId: cid, type : datas.type }] }]))
            return;
        }
        const data = JSON.parse(unStaticDBData) as { guildId: string, datas : { channelId : string , type : SendCategory }[] }[]
        
        const finder = data.find( val => val.guildId === gid);
        if(finder) {
            if(finder.datas.find( chid => chid.channelId === cid)) return 0
            finder.datas.push({ channelId : cid , type : datas.type })
        }
        
        else data.push({ guildId: gid, datas : [{ channelId: cid, type : datas.type}] });
        await this.db.set(`channels`, JSON.stringify( data ))
        return 1;
    }

    async unRegister(gid: string , cid : string): Promise<0 | 1> {
        const unStaticDBData = await this.db.get(`channels`)
        if(!unStaticDBData || typeof unStaticDBData === "undefined") {
            return 0;
        }        
        const data = JSON.parse(unStaticDBData) as { guildId: string, datas : { channelId : string , type : SendCategory }[] }[]
        const GuildData = data.find( data => data.guildId === gid );
        if(!GuildData) return 0;
        if(GuildData.datas.length === 0) return 0;
        const RemovedData = data.filter( data => data.guildId !== gid )
        const RemovedGuildData = GuildData.datas.filter( data => data.channelId !== cid )

        if( RemovedGuildData.length === GuildData.datas.length ) return 0;

        const SaveGuildData = RemovedGuildData.length === 1 ? [] : [ ...RemovedGuildData ] 
        const Merge = [...RemovedData, { guildId : gid , datas : SaveGuildData }]

        console.log( JSON.stringify( Merge ))

        await this.db.set(`channels`, JSON.stringify( Merge ))
        return 1
    }

    async checkChannelSetting( gid : string , cid : string ) : Promise<0 | { type : SendCategory } >{
        const unStaticDBData = await this.db.get(`channels`)
        if(!unStaticDBData || typeof unStaticDBData === "undefined") {
            return 0;
        }        
        const data = JSON.parse(unStaticDBData) as { guildId: string, datas : { channelId : string , type : SendCategory }[] }[]
        
        const GuildData = data.find( data => data.guildId === gid );
        if(!GuildData) return 0;
        if(GuildData.datas.length === 0) return 0;

        const ChannelSetting = GuildData.datas.find( data => data.channelId === cid)
        if(!ChannelSetting) return 0;

        return { type : ChannelSetting.type }
    }
}