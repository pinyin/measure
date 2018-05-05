import {EventHandler} from '@pinyin/react'
import {px} from '@pinyin/types'

export type ResizeEvents = {
    onHeightChange?: EventHandler<px>
    onWidthChange?: EventHandler<px>
}
