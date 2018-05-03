import {PropsOf, Referable} from '@pinyin/react'
import {ComponentClass} from 'react'
import {MeasureProps} from './MeasureProps'

export type Measured<A extends Referable> = ComponentClass<PropsOf<A> & MeasureProps<A>>
