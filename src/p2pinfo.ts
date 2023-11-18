


import { Client as P2PClient } from "p2peq_event";
import { ChannelSendManager, IChannelSendManager } from "./client/sendManager";
import { ResolveNullishNumber } from "./utils/resolveNumber";
import { ResolveTsunamiInfomation } from "./utils/resolveTsunami";
import { AreaSender } from "./client/areaSender";
import { ResolveType } from "./utils/resolveType";
import { TsunamiSender } from "./client/tsunamiSender";

const client = new P2PClient({sandboxUri : "wss://api-realtime-sandbox.p2pquake.net/v2/ws"})

client.on('ready', ( data ) => {
    console.log(`${data.connection} | ${data.wsurl}\n Successfully connected at p2p earthquake server. `)
})

client.on("earthquake", ( data ) => {

    const FirstInfomation : IChannelSendManager = {
        title : `地震情報 - ${ResolveType(data.issue.type)} `,
        description : `\n・震源・規模情報\n**${data.earthquake.hypocenter.name ?? "調査中"}** / M ${ResolveNullishNumber(data.earthquake.hypocenter.magnitude)} / 深さ ${ResolveNullishNumber(data.earthquake.hypocenter.depth, "km")}\n\n \`\`\`\n ${ResolveTsunamiInfomation(data.earthquake.domesticTsunami)}\n\`\`\`\n`,
        page : 1,
        maxPage : 1
    }

    new ChannelSendManager(FirstInfomation).build();
    new AreaSender(data.points)
})

client.on('tsunamiwarning', ( data ) => {

    const Infomation : IChannelSendManager = {
        title : `津波情報 - ${data.cancelled ? "解除" : "発表"}`,
        description : `**津波情報が発表されました。**\n・発表時間\n${data.issue.time}\n・発表元\n${data.issue.source}`,
        page : 1,
        maxPage : 1
    }

    new ChannelSendManager(Infomation).build();
    new TsunamiSender(data);
})
