

import { Client as P2PClient } from "p2peq_event";

import {
    Client,
    GatewayIntentBits
} from "discord.js";
import { TsunamiSender } from "./tsunamiSender";
import { ChannelSendManager, IChannelSendManager } from "./sendManager";
import { Token } from "../constants/token";


export const client = new Client({
    intents : [
        GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages
    ]
})

client.on('ready', () => {
    console.log(`
        Logined at ${client.user?.username}
    `)
})

client.on('messageCreate', async (message) => {
    if(message.content === "!t-tsunami") {
        const info = await new P2PClient().cache.resolve("61e31ba302add671aad96af1")
        console.log(info)
        if(info.code === 552){
            const Infomation : IChannelSendManager = {
                title : `津波情報 - ${info.cancelled ? "解除" : "発表"}`,
                description : `**津波情報が発表されました。**\n・発表時間\n\`${info.issue.time}\`\n・発表元\n\`${info.issue.source}\`\n\n以下は高さ・到達予想時刻の一覧です。\n(⚠️印が付いているものは、すぐ到達することが予想される地域です。)`,
                page : 1,
                maxPage : 1
            }
        
            new ChannelSendManager(Infomation).build();
            new TsunamiSender(info)
        }
    }
})

client.login(Token)