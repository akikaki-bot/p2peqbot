
import {
    Client,
    GatewayIntentBits
} from "discord.js";
import { Token } from "../constants/token";



export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages
    ]
})

client.on('ready', () => {
    console.log(`
        Logined at ${client.user?.username}
    `)

    let display = 0;
    setInterval(() => {
        const displayText = [`Producted by https://sdev.aknet.tech/`, `Powered by Wolfx and P2P Earthquake`]
        client.user?.setActivity({
            name : displayText[display]
        })
        display + 1 === displayText.length ? display = 0 : display++
    }, 10000)
})


client.login(Token)
export { 
    WolfxManager
} from "./wolfxClient"
export {
    AreaSender
} from "./areaSender"
export {
    ChannelSendManager,
    IChannelSendManager
} from "./sendManager"
export {
    TsunamiSender
} from "./tsunamiSender"
export {
    EEWSender
} from "./eewSender"