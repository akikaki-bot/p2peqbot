
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
})


client.login(Token)

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