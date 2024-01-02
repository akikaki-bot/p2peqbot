

export class WolflxParser {

    /** 発表元のタイプ */
    type : "jma_eew"
    /** EEWのタイトル */
    Title : string
    /** EEWコード */
    CodeType : string
    /** EEWの発表元・ステータス */
    Issue : Issue
    /** Event ID */
    EventID : string
    /** 何報目か */
    Serial : string
    /** 発表時刻 */
    AnnouncedTime : string
    /** 発生時刻 */
    OriginTime : string
    /** 震源地 */
    Hypocenter : string
    /** 震源地緯度 */
    Latitude : number
    /** 震源地経度 */
    Longitude : number
    /** マグニチュード */
    Magunitude : number
    /** 深さ */
    Depth : number
    /** 最大震度 */
    MaxIntensity : string
    /** 計測方法について */
    Accuracy : Accuracy
    /** 最大震度は変わったのかの文 */
    MaxIntChange : MaxIntChange
    /** 警報地域 */
    WarnArea : Array<WarnArea> | []
    /** 海震源？ */
    isSea : boolean
    /** 訓練？ */
    isTraining : boolean
    /** 推定の方法がわかる？ */
    isAssumption : boolean
    /** 警報？ */
    isWarn : boolean
    /** 最終報？ */
    isFinal : boolean
    /** キャンセル報？ */
    isCancel : boolean
    /** Binaryデータ */
    OriginalText : JMABinary

    constructor( data : WolflxParser ) {
        this.type = data.type;
        this.Title = data.Title;
        this.CodeType = data.CodeType;
        this.Issue = data.Issue;
        this.EventID = data.EventID;
        this.Serial = data.Serial;
        this.AnnouncedTime = data.AnnouncedTime;
        this.OriginTime = data.OriginTime;
        this.Hypocenter = data.Hypocenter;
        this.Latitude = data.Latitude;
        this.Longitude = data.Longitude;
        this.Magunitude = data.Magunitude;
        this.Depth = data.Depth;
        this.MaxIntensity = data.MaxIntensity;
        this.Accuracy = data.Accuracy;
        this.MaxIntChange = data.MaxIntChange;
        this.WarnArea = data.WarnArea;
        this.isSea = data.isSea;
        this.isTraining = data.isTraining;
        this.isAssumption = data.isAssumption;
        this.isWarn = data.isWarn;
        this.isFinal = data.isFinal;
        this.isCancel = data.isCancel;
        this.OriginalText = data.OriginalText;
    }   
}

export type JMABinary = string

export interface WarnArea {
    /** 警報区分 */
    Chiiki : string
    /** 最大震度 */
    Shindo1 : string
    /** 考えられる最小震度 */
    Shindo2 : string
    /** 発表時間 */
    Time : string
    /** 予報区分か警報区分か */
    Type : "予報" | "警報" 
    /** 到達済か */
    Arrive : boolean
}

/** 最大震度は変わったのかの文 */
export interface MaxIntChange {
    String : string
    Reason : string
}

/** 計測方法について */
export interface Accuracy {
    Epicenter : string
    Depth : string
    Magunitude : string
}

export interface Issue {
    /** 発表元 */
    Source : string
    /** 送信状況 */
    Status : string
}