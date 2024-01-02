

export interface IHeartbeat {
    type: 'heartbeat',
    ver: number,
    id: string,
    timestamp: number,
    message: string
}