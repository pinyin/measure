import {EventHandler, InnerRef, Referable} from '@pinyin/react'
import {px} from '@pinyin/types'

export type MeasureProps<T extends Referable> = {
    onHeightChange?: EventHandler<px>
    onWidthChange?: EventHandler<px>
} & InnerRef<T>
