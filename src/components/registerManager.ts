import { CommandInteraction, EmbedBuilder } from "discord.js";
import { ResolveSendCategory } from "../utils/resolveSendCategory";
import { RegisterManager } from "../client/channelClient";

const manager = new RegisterManager(`db/`)

/**
 * 
 * # こら～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～～っ
 * 
 * なめすぺーすはできるだけ使うなはげー！！！！！！！！！！！！！！！！！
 */
export namespace ChannelRegisterManagers {

    export async function Register( interaction : CommandInteraction ) {

        const SendCategory = interaction.options.get("category", true).value;
        const ChannelId = interaction.channel.id;

        if( typeof SendCategory !== "number" ) 
            return interaction.reply(
                { 
                    embeds : [ 
                        new EmbedBuilder().setTitle('エラーが発生しました。').setDescription(`登録上の問題が発生しました。どうやらoptionがnumberでないようです。\nサポートサーバーへの報告をお願いします。`).setColor('Red')
                    ],
                    ephemeral : true
                }
            )

        const CategoryResolved = ResolveSendCategory( SendCategory );
        const result = await manager.register( interaction.guild.id , ChannelId , { type : CategoryResolved })
        if(result === 1) {
            const embed = new EmbedBuilder().setTitle('登録が完了しました✔').setDescription(`登録チャンネル : <#${ChannelId}>\n登録情報種別： ${CategoryResolved.description}`).setColor('Blue');
            return interaction.reply({ 
                embeds : [ embed ],
                ephemeral : true
            })
        } else {
            const embed = new EmbedBuilder().setTitle('登録に失敗しました....').setDescription(`このチャンネルで既に登録してあるようです。`).setColor('DarkRed');
            return interaction.reply({ 
                embeds : [ embed ],
                ephemeral : true
            })
        } 
    }

    export async function UnRegister( interaction : CommandInteraction ) {
        
        const ChannelId = interaction.channel.id;

        const result = await manager.unRegister( interaction.guild.id, interaction.channel.id )
        if(result === 1) {
            const embed = new EmbedBuilder().setTitle('登録解除が完了しました').setDescription(`ご利用ありがとうございました。`).setColor('Blue');
            return interaction.reply({ 
                embeds : [ embed ],
                ephemeral : true
            })
        } else {
            const embed = new EmbedBuilder().setTitle('登録解除に失敗しました....').setDescription(`登録がされてないようです。`).setColor('DarkRed');
            return interaction.reply({ 
                embeds : [ embed ],
                ephemeral : true
            })
        } 
    }

    export async function CheckSetting( interaction : CommandInteraction ) {
        const setting = await manager.checkChannelSetting( interaction.guild.id , interaction.channel.id );
        if(setting === 0) {
            const embed = new EmbedBuilder().setTitle('登録照会に失敗しました....').setDescription(`登録がされてないようです。`).setColor('DarkRed');
            return interaction.reply({ 
                embeds : [ embed ],
                ephemeral : true
            })
        }
        else {
            const embed = new EmbedBuilder().setTitle('登録照会').setDescription(`チャンネル：<#${interaction.channel.id}>\n送信する情報種別：${setting.type.description}`).setColor('Blue');
            return interaction.reply({ 
                embeds : [ embed ],
                ephemeral : true
            })
        }
    }

    
}

