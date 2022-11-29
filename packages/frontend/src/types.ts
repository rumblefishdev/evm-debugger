import type { ICallTypeTraceLog, ICreateTypeTraceLog } from '@evm-debuger/types'

export type TTraceLog = ICallTypeTraceLog | ICreateTypeTraceLog

export type TParsedExtendedTraceLog = TTraceLog & {
    width: number
    height: number
    x: number
    y: number
    nestedItems: TParsedExtendedTraceLog[]
}
