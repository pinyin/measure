import {ComponentClass, ReactHTML, StatelessComponent} from 'react'

export type Measurable = ComponentClass<any> | StatelessComponent<any> | keyof ReactHTML
