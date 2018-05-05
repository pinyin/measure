import {PropsOf, RefOf} from '@pinyin/react'
import {ClassAttributes, ComponentType} from 'react'
import {Measurable} from './Measurable';
import {ResizeEvents} from './ResizeEvents';

export type Measured<C extends Measurable> = ComponentType<PropsOf<C> &
    ResizeEvents &
    ClassAttributes<RefOf<C>>>
