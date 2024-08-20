
import {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder
} from "discord.js";
import { Token } from "../constants/token";
import * as Keyv from "keyv"
import { SendCategory } from "../utils/resolveSendCategory";
import { ChannelRegisterManagers } from "../components/registerManager";
import { screenshotClient } from "../p2pinfo";



export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages
    ]
})

client.on('ready', async () => {
    
    console.log(`
        Logined at ${client.user?.username}
    `)

    const db = new Keyv({ uri : "sqlite://db/channels.dat" })

    async function GetRegisteredChannelsCount() {
        const guilds = await db.get(`channels`)
        const GuildChannels = JSON.parse( guilds )  as { guildId: string, datas : { channelId : string , type : SendCategory }[] }[]
        const counts = GuildChannels.map( v => v.datas.length ).reduce((acc , v ) => acc + v, 0)
        return counts
    }

    function GetGuildCount() {
        return client.guilds.cache.size
    }

    let display = 0;
    setInterval(async () => {
        const displayText = [`/helpでコマンドの設定方法をご覧にいただけます。`, `${GetGuildCount()}鯖 ${await GetRegisteredChannelsCount()}箱`]
        client.user?.setActivity({
            name : displayText[display]
        })
        display + 1 === displayText.length ? display = 0 : display++
    }, 10000)

    await client.application?.commands.set([
        new SlashCommandBuilder().setName('register').setDescription(`地震情報の送信登録をします。`).addNumberOption(option => option.setName(`category`).setMinValue(1).setMaxValue(4).setDescription(`1はすべての情報、2は警報のみ、3は予報・警報EEWのみ、4は地震情報のみです。`).setRequired(true)),
        new SlashCommandBuilder().setName('unregister').setDescription(`地震情報送信の登録解除をします。`),
        new SlashCommandBuilder().setName('help').setDescription(`このボットの説明です。`),
        new SlashCommandBuilder().setName('chsetting').setDescription(`チャンネルの設定を確認できます。`),
        new SlashCommandBuilder().setName('takeinfo').setDescription(`スクリーンショットのテスト。`)
    ])
})


client.on('interactionCreate', async ( interaction ) => {
    if( !interaction.isCommand() ) return;
    if( interaction.commandName === "register") { 
        if( !interaction.memberPermissions?.has( PermissionsBitField.Flags.ManageChannels )) { 
            await interaction.reply({ content : "権限が足りません。チャンネルを管理する権限が必要です。" , ephemeral : true } )
            return;
        }
        await ChannelRegisterManagers.Register( interaction )  
        return; 
    }
    if( interaction.commandName === "unregister" ) {
        if( !interaction.memberPermissions?.has( PermissionsBitField.Flags.ManageChannels )) { 
            await interaction.reply({ content : "権限が足りません。チャンネルを管理する権限が必要です。" , ephemeral : true } )
            return;
        }
        await ChannelRegisterManagers.UnRegister( interaction )  
        return; 
    }
    if( interaction.commandName === "takeinfo") {
        screenshotClient.takeScreenShot().then( async buff => {
            await interaction.reply({ files : [ buff ] , ephemeral : true })
        })
    }
    if( interaction.commandName === "chsetting") {
        await ChannelRegisterManagers.CheckSetting( interaction )
        return;
    }
    if( interaction.commandName === "help"){

        const embed = new EmbedBuilder().setTitle('EERapid bot').setDescription(`

            ## **各コマンドの説明**

            - </help:1192135850708963328>
            このボットの説明が表示されるコマンドです。
            まず最初はこれをご覧ください。

            - </register:1192018880277774387> 〉**チャンネルを管理する権限が必要**
    このコマンドが送信されたチャンネルを登録します。
    1 ~ 4の引数で送信する情報を選択します。
    登録するチャンネル数に上限はございません。

    ・引数で選ぶことのできる情報種別
            \`\`\`
1. 全ての情報
2. 緊急地震速報（警報）のみ
3. 緊急地震速報（警報・予報）のみ
4. 震度速報・震源情報・各地の震度情報のみ
\`\`\`
    
            - </unregister:1192018880277774388> 〉 **チャンネルを管理する権限が必要**
            このコマンドが送信されたチャンネルに登録されている設定を解除します。

            - 利用API等
                - 緊急地震速報メインAPI [Wolfx](https://api.wolfx.jp/)
                - 地震情報メインAPI [P2P地震情報](https://www.p2pquake.net/)
                
            - 開発者
                - あきかき (akikaki)

        `).setColor('Blue')

        interaction.reply({ embeds :[ embed ] , ephemeral : true })
    }
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