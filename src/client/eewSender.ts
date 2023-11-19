import { DetailEEW, IEEWArea } from "p2peq_event/dist/src/components/detaileew";
import { ResolveScale } from "../utils/resolveScale";
import { ChannelSendManager, IChannelSendManager } from "./";



export class EEWSender {


    private data : DetailEEW

    constructor( data : DetailEEW ) {
        this.data = data;
        this.init();
    }


    private async init() {
        const Areas = this.data.areas
        const PrefChunk = this.WarningPrefChunk(Areas)
        const Points = PrefChunk.map((chunked) => ({ pref : chunked.pref , areas : this.chunkArray<IEEWArea>(chunked.areas, 25)}))
        const TextedEEW = Points.map((info) => ({ pref : info.pref , areas : info.areas.map((chunkedAreas) => chunkedAreas.map((areas) => `${areas.name}\n\`\`\`\n予想震度${ResolveScale(areas.scaleFrom)}${areas.scaleTo === 99 ? "以上" : `から${ResolveScale(areas.scaleTo)}`}\n到達時間 : ${areas.arrivalTime}\n\`\`\``))}))
        const Manager = TextedEEW.map(
            (info , index, chunk) => (
                info.areas.map((areaText , _ , arr) => {
                    return {
                        title : `緊急地震速報 (地域詳細) - ${info.pref} (${_ + 1}/${arr.length})`,
                        description : areaText.join('\n'),
                        page : index + 1,
                        maxPage : chunk.length,
                        color : "DarkRed"
                    } as IChannelSendManager
                })
            )
        )

        const FlatedManager = Manager.flat(2).filter((val) => typeof val !== "number")
        await Promise.all([
            FlatedManager.map(manager => new ChannelSendManager(manager).build())
        ])
    }

    private WarningPrefChunk<T extends IEEWArea>(areas : T[]) {
        const Warnings : string[] = []
        areas.map(( area, _ ) => !Warnings.includes(area.pref) && Warnings.push(area.pref))
        return Warnings.map((warning) => ({ pref : warning, areas : areas.filter((areas, _) => areas.pref === warning) }))
    }

    private chunkArray<T = unknown>(array: T[], size: number): T[][] {
        const hoge = (arr: T[], size: number) => arr.flatMap((_, i, a) => i % size ? [] : [a.slice(i, i + size)]);
        return hoge(array, size)
    }
}