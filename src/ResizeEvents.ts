import {EventHandler, px} from '@pinyin/types'

export type ResizeEvents = {
    onHeightChange?: EventHandler<px>
    onWidthChange?: EventHandler<px>
}
