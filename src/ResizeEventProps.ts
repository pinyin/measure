import {EventHandler} from '@pinyin/react'
import {px} from '@pinyin/types'

export type ResizeEventProps = {
    onHeightChange?: EventHandler<px>
    onWidthChange?: EventHandler<px>
}
