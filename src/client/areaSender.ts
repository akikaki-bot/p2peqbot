import { PointFormat } from "p2peq_event/dist/src/types";
import { ResolveScale } from "../utils/resolveScale";
import { ChannelSendManager, IChannelSendManager } from "./sendManager"


export class AreaSender {

    private point: PointFormat[]
    private points: number
    private thinkPage: number
    private allPage: number

    constructor(data: PointFormat[]) {
        this.point = data;
        this.points = data.length;
        this.thinkPage = 1;
        this.allPage = Math.round(data.length / 20) + 1

        this.init()
    }

    private async init() {
        const PrefChunked = this.prefChunk(this.point)
        const Points = PrefChunked.map((chunked) => ({ name : chunked.name, areas: this.chunkArray<PointFormat>(chunked.areas, 25) }))
        const chunkedInfo = Points.map(points => ({ name: points.name, areas : points.areas.map(chunkedArea => chunkedArea.map((area) => `[${ResolveScale(area.scale)}] ${area.addr}`)) }))
        const Manager = chunkedInfo.map(
            (info, index, chunk) => (
                info.areas.map((area, _, arr) => {
                    return {    
                        title : `地域ごとの震度分布 - ${info.name} (${_ + 1}/${arr.length})`,
                        description : area.join('\n'),
                        page : index + 1,
                        maxPage : chunk.length
                    } as IChannelSendManager
                })
            )
        )

        const FlatedManager = Manager.flat(2).filter((val) => typeof val !== "number")
        await Promise.all([
            FlatedManager.map(manager => new ChannelSendManager(manager).build())
        ])
    }

    private prefChunk<T extends PointFormat>(prefInfos : T[]) {
        const Prefs : string[] = []
        prefInfos.map((points, _ ) => !Prefs.includes(points.pref) && Prefs.push(points.pref))
        return Prefs.map((prefName) => ({ name : prefName, areas : prefInfos.filter((points, _) => points.pref === prefName) }))
    }

    private chunkArray<T = unknown>(array: T[], size: number): T[][] {
        const hoge = (arr: T[], size: number) => arr.flatMap((_, i, a) => i % size ? [] : [a.slice(i, i + size)]);
        return hoge(array, size)
    }
}