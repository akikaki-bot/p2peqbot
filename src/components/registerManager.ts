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

        const ClientUser = await interaction.guild.members.fetch( interaction.client.user );

        if( !ClientUser.permissions.has('SendMessages') ||  !ClientUser.permissions.has('ViewChannel') ){
            interaction.reply({ content : "エラーが発生しました。" , ephemeral : true })
            return interaction.user.send({content : `<#${interaction.channelId}>での権限が不足しています。\n・チャンネルを見る\n・メッセージを送る\nを最低でも権限として付与してください。`})
        }

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

