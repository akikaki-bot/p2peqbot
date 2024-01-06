


import { Client as P2PClient } from "p2peq_event";
import { ResolveNullishNumber } from "./utils/resolveNumber";
import { ResolveTsunamiInfomation } from "./utils/resolveTsunami";
import { ResolveType } from "./utils/resolveType";
import { ResolveSindoColor } from "./utils/resolveShindoColor";
import { ResolveAccuracy } from "./utils/resolveAccuracyWay";

import { 
    ChannelSendManager,
    IChannelSendManager , 
    EEWSender , 
    TsunamiSender, 
    AreaSender,
    WolfxManager
} from "./client/";
import { ResolveSindoString } from "./utils/resolveSindoNumber";
import { IfBool, IfCancel, ResolveCancel } from "./utils/resolveCancel";
import { ResolveSendCategory } from "./utils/resolveSendCategory";



const client = new P2PClient()
const wolfxClient = new WolfxManager()

client.on('ready', ( data ) => {
    console.log(`${data.connection} | ${data.wsurl}\n Successfully connected at p2p earthquake server. `)
})

wolfxClient.on('open', () => {
    console.log(` Successfully connected at Wolfx server.`)
})

wolfxClient.on('ping', (data) => {
    console.log(`Ping! | ${data.timestamp} / ${data.message}`)
})

wolfxClient.on('eew', ( data ) => {

    const Infomation : IChannelSendManager = {
        title : ResolveCancel( data.isCancel , `緊急地震速報 (${data.isWarn ? "警報" : "予報"}) - ${data.isFinal ? "最終" : "第"+data.Serial}報` ),
        description : IfCancel( data.isCancel , `\n・${IfBool( data.isAssumption , "仮定震源要素情報","震源・規模情報")}\n**${data.Hypocenter ?? `不明`}** (${data.Accuracy.Epicenter})  \n M ${ResolveNullishNumber(data.Magunitude)} / 深さ ${ResolveNullishNumber(data.Depth)}km \n\n \`\`\`\n震源に近い地域では*最大震度${data.MaxIntensity}程度*の揺れが予想されます。\n\`\`\``),
        page : 1,
        maxPage: 1,
        footerText : `EEWInfomation | EventID : ${data.EventID} `,
        color : ResolveSindoColor( ResolveSindoString( data.MaxIntensity ) ),
        sendCategory : [ ResolveSendCategory( 1 ) , ResolveSendCategory( 3 ) ]
    }

    if( data.isWarn ) Infomation.sendCategory.push( ResolveSendCategory( 2 ) )

    new ChannelSendManager(Infomation).build();

})

client.on("earthquake", ( data ) => {
    
    const FirstInfomation : IChannelSendManager = {
        title : `地震情報 - ${ResolveType(data.issue.type)} `,
        description : `\n・震源・規模情報\n**${data.earthquake.hypocenter.name ?? "調査中"}** / M ${ResolveNullishNumber(data.earthquake.hypocenter.magnitude)} / 深さ ${ResolveNullishNumber(data.earthquake.hypocenter.depth, "km")}\n\n \`\`\`\n ${ResolveTsunamiInfomation(data.earthquake.domesticTsunami)}\n\`\`\`\n`,
        page : 1,
        maxPage : 1,
        color : ResolveSindoColor( data.earthquake.maxScale ),
        sendCategory : [ ResolveSendCategory( 1 ), ResolveSendCategory( 4 ) ]
    }

    new ChannelSendManager(FirstInfomation).build();
    new AreaSender(data.points, data.earthquake.maxScale )
})

client.on('infomations', (data) => console.log(data.code))

client.on('tsunamiwarning', ( data ) => {

    const Infomation : IChannelSendManager = {
        title : `津波情報 - ${data.cancelled ? "解除" : "発表"}`,
        description : `**津波情報が発表されました。**\n・発表時間\n${data.issue.time}\n・発表元\n${data.issue.source}`,
        page : 1,
        maxPage : 1,
        color : "Blurple",
        sendCategory : [ ResolveSendCategory( 1 ), ResolveSendCategory( 5 ) ]

    }

    new ChannelSendManager(Infomation).build();
    new TsunamiSender(data);
})

client.on('eew', ( data ) => {
    const Infomation : IChannelSendManager = {
        title : `緊急地震速報 - ${data.test ? "テスト" : "警報"}`,
        description : `緊急地震速報です。\n対象地域は5弱以上の揺れが予想されます。\n落ち着いて身の安全を図ってください。\n\n・震源情報\n**${typeof data.earthquake !== "undefined" ? data.earthquake.hypocenter.name : "不明"}** / M ${typeof data.earthquake !== "undefined" ? data.earthquake.hypocenter.magnitude : "不明"} / 深さ ${typeof data.earthquake !== "undefined" ? data.earthquake.hypocenter.depth : "不明"}km \n\n 対象地域は以下の通りです。 \n 発表時刻：\`${data.time}\``,
        page : 1,
        maxPage : 1,
        color : "Red",
        sendCategory : [ ResolveSendCategory( 1 ), ResolveSendCategory( 2 ) , ResolveSendCategory( 3 ) ]
    }

    new ChannelSendManager(Infomation).build();
    new EEWSender(data)
})
