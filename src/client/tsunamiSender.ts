import { Tsunami } from "p2peq_event";


import { TsunamiAreas, TsunamiTypes } from "p2peq_event/dist/src/types"
import { ChannelSendManager, IChannelSendManager } from "./";
import { ResolveTsunamiType } from "../utils/resolveTsunamiTypes";
import { ResolveTsunamiColor } from "../utils/resolveTsunamiColor";
import { ResolveSendCategory } from "../utils/resolveSendCategory";

export class TsunamiSender {

    private data : Tsunami

    constructor( data : Tsunami ) {
        this.data = data;
        this.init()
    }

    private async init() {

        const Areas = this.data.areas
        const Chunked = this.WarningChunk(Areas)
        const TsunamiPoints = Chunked.map((chunked) => ({ grade : chunked.grade, areas : this.chunkArray<TsunamiAreas>(chunked.areas, 10)}))
        const TextedInfo = TsunamiPoints.map((info) => ({ grade : info.grade, areas : info.areas.map((chunkedAreas) => chunkedAreas.map((areas) => `${areas.immediate ? "⚠️" : ""}${areas.name}\n\`\`\`\n予想高さ：${typeof areas.maxHeight !== "undefined" && areas.maxHeight.description ? areas.maxHeight.description : "提供なし"}\n到達時刻：${typeof areas.firstHeight !== "undefined" && areas.firstHeight.arrivalTime ? areas.firstHeight.arrivalTime : "提供なし"}\n\`\`\``))}))
        const Manager = TextedInfo.map(
            (info, index, chunk) => (
                info.areas.map((areaText, _ , arr) => {
                    return {
                        title : `津波予報 - ${ResolveTsunamiType(info.grade)}(${_ + 1}/${arr.length})`,
                        description : areaText.join('\n'),
                        page : index + 1,
                        maxPage : chunk.length,
                        color : ResolveTsunamiColor( info.grade ),
                        sendCategory : [ ResolveSendCategory( 1 ) , ResolveSendCategory( 5 )]
                    } as IChannelSendManager
                })
            )
        )

        const FlatedManager = Manager.flat(2).filter((val) => typeof val !== "number")
        await Promise.all([
            FlatedManager.map(manager => new ChannelSendManager(manager).build())
        ])
    }

    private WarningChunk<T extends TsunamiAreas>(areas : T[]) {
        const Warnings : TsunamiTypes[] = []
        areas.map(( area, _ ) => !Warnings.includes(area.grade) && Warnings.push(area.grade))
        return Warnings.map((warning) => ({ grade : warning, areas : areas.filter((areas, _) => areas.grade === warning) }))
    }

    private chunkArray<T = unknown>(array: T[], size: number): T[][] {
        const hoge = (arr: T[], size: number) => arr.flatMap((_, i, a) => i % size ? [] : [a.slice(i, i + size)]);
        return hoge(array, size)
    }
}