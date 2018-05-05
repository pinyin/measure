import {PropsOf, RefOf} from '@pinyin/react'
import {ClassAttributes, ComponentType} from 'react'
import {Measurable} from './Measurable';
import {ResizeEventProps} from './ResizeEventProps';

export type Measured<C extends Measurable> = ComponentType<PropsOf<C> &
    ResizeEventProps &
    ClassAttributes<RefOf<C>>>
