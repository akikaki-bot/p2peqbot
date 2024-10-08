import { PointFormat } from "p2peq_event/dist/src/types";
import { ResolveScale } from "../utils/resolveScale";
import { ChannelSendManager, IChannelSendManager } from "./"
import { ResolveSindoColor } from "../utils/resolveShindoColor";
import { Points, Scale } from "p2peq_event/dist/src/types/jmaquake";
import { ResolveSendCategory } from "../utils/resolveSendCategory";
import { ScreenShot } from "./screenshotClient";


export class AreaSender {

    private point: Points[]
    private maxScale : Scale | -1
    private ScreenShotClient : ScreenShot

    constructor(data: Points[], maxScale : Scale | -1, client : ScreenShot ) {
        this.point = data;
        this.maxScale = maxScale
        this.ScreenShotClient = client;

        this._init()
    }

    private async _init() {
        this.ScreenShotClient.takeScreenShot()
        .then( async buff => {;
            const Infomation = {    
                title : `地域ごとの震度分布`,
                description : "緊急地震速報地域区分GISデータ提供 : 気象庁",
                color : ResolveSindoColor( this.maxScale ),
                sendCategory : [ ResolveSendCategory( 1 ), ResolveSendCategory( 4 ) ],
                imageBuffer : buff
            } as IChannelSendManager

            await new ChannelSendManager( Infomation ).buildWithImage();
        })
    }

    private async init() {
        const PrefChunked = this.prefChunk(this.point)
        const Points = PrefChunked.map((chunked) => ({ name : chunked.name, areas: this.chunkArray<Points>(chunked.areas, 30) }))
        const chunkedInfo = Points.map(points => ({ name: points.name, areas : points.areas.map(chunkedArea => chunkedArea.map((area) => `[${ResolveScale(area.scale)}] ${area.addr}`)) }))
        const Manager = chunkedInfo.map(
            (info, index, chunk) => (
                info.areas.map((area, _, arr) => {
                    return {    
                        title : `地域ごとの震度分布 - ${info.name} (${_ + 1}/${arr.length})`,
                        description : area.join('\n'),
                        page : index + 1,
                        maxPage : chunk.length,
                        color : ResolveSindoColor( this.maxScale ),
                        sendCategory : [ ResolveSendCategory( 1 ), ResolveSendCategory( 4 ) ]
                    } as IChannelSendManager
                })
            )
        )

        const FlatedManager = Manager.flat(2).filter((val) => typeof val !== "number")
        FlatedManager.map(manager => new ChannelSendManager(manager).build())
    }

    private prefChunk<T extends Points>(prefInfos : T[]) {
        const Prefs : string[] = []
        prefInfos.map((points, _ ) => !Prefs.includes(points.pref) && Prefs.push(points.pref))
        return Prefs.map((prefName) => ({ name : prefName, areas : prefInfos.filter((points, _) => points.pref === prefName) }))
    }

    private chunkArray<T = unknown>(array: T[], size: number): T[][] {
        const hoge = (arr: T[], size: number) => arr.flatMap((_, i, a) => i % size ? [] : [a.slice(i, i + size)]);
        return hoge(array, size)
    }
}