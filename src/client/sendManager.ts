
import {
    TextChannel,
    NewsChannel,
    EmbedBuilder,
    ColorResolvable,
    ChannelType
} from "discord.js"
//import { Channels } from "../constants/channels";
import { client } from ".";
import * as Keyv from "keyv"
import { SendCategory } from "../utils/resolveSendCategory";


export class ChannelSendManager {

    private data : IChannelSendManager;
    private db : Keyv<any>

    constructor( data : IChannelSendManager ) {
        this.data = data;
        this.db = new Keyv(`sqlite://db/channels.dat`)
    }

    async build() {
        const _data = this.data
        console.log( _data )
        const embed = new EmbedBuilder().setTitle( _data.title ?? "不明な情報種別" ).setDescription( _data.description ?? "不明な情報説明" ).setFooter({ text : `EarthQuakeBot | ${typeof _data.footerText !== "undefined" ? _data.footerText : "AreaPage"} - ${_data.page ?? 1}/${_data.maxPage ?? 1}` }).setColor( _data.color ?? "Default" )

        await this.send(embed)
    }

    async send( embed : EmbedBuilder ) {

        const PromisedChannel = await this.db.get(`channels`) 
        const GuildChannels = JSON.parse( PromisedChannel )  as { guildId: string, datas : { channelId : string , type : SendCategory }[] }[]

        if(!Array.isArray(GuildChannels)) throw new Error('Guild channels data broken.')

        await Promise.all([
            GuildChannels.map(async guildData => {
                guildData.datas.map(async id => {
                    const catgoryMatched = this.data.sendCategory.some(v => v.type === id.type.type)
                    if( !catgoryMatched ) return;
                    const Channel = client.channels.resolve( id.channelId )
                    if(Channel?.isTextBased() && ( Channel instanceof ( TextChannel || NewsChannel ) || Channel.type === ChannelType.GuildAnnouncement) ){
                        const Message = await Channel.send({
                            embeds : [embed]
                        }).catch(err => console.log(err))
                        if(typeof Message !== "object") return;
                        if(Channel.type === ChannelType.GuildAnnouncement) {
                            if(Message.crosspostable) {
                                Message.crosspost()
                                .catch((err) => console.log(err))
                            }
                        }
                    }
                })
            })
        ])
    }
}

export interface IChannelSendManager {
    title : string
    description : string
    page ?: number
    maxPage ?: number
    color ?: ColorResolvable
    footerText ?: string
    sendCategory : SendCategory[]
}