import {PropsOf, RefOf} from '@pinyin/react'
import {ComponentType, Key, RefObject} from 'react'
import {Measurable} from './Measurable'
import {ResizeEvents} from './ResizeEvents';

export type Measured<C extends Measurable> = ComponentType<PropsOf<C> &
    ResizeEvents &
    { key?: Key } &
    { ref?: ((ref: RefOf<C> | null) => void) | RefObject<RefOf<C>> }>
