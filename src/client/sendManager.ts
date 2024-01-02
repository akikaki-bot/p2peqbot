
import {
    TextChannel,
    NewsChannel,
    EmbedBuilder,
    ColorResolvable
} from "discord.js"
import { Channels } from "../constants/channels";
import { client } from ".";

export class ChannelSendManager {

    private data : IChannelSendManager;

    constructor( data : IChannelSendManager ) {
        this.data = data;
    }

    async build() {
        const _data = this.data
        console.log(_data )
        const embed = new EmbedBuilder().setTitle( _data.title ?? "不明な情報種別" ).setDescription( _data.description ?? "不明な情報説明" ).setFooter({ text : `EarthQuakeBot | ${typeof _data.footerText !== "undefined" ? _data.footerText : "AreaPage"} - ${_data.page ?? 1}/${_data.maxPage ?? 1}` }).setColor( _data.color ?? "Default" )

        await this.send(embed)
    }

    async send( embed : EmbedBuilder ) {
        await Promise.all([
            Channels.map(async id => {
                const Channel = client.channels.resolve(id)
                if(Channel?.isTextBased() && Channel instanceof ( TextChannel || NewsChannel ) ){
                    await Channel.send({
                        embeds : [embed]
                    })
                }
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
}