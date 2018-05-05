import {assume, existing, Maybe, nothing} from '@pinyin/maybe'
import {PropsOf, RefOf} from '@pinyin/react'
import {Component, ComponentClass, createElement, forwardRef, Ref} from 'react'
import {findDOMNode} from 'react-dom'
import ResizeObserver from 'resize-observer-polyfill'
import {Measurable} from './Measurable';
import {Measured} from './Measured';
import {ResizeEventProps} from './ResizeEventProps'
import hoistNonReactStatics = require('hoist-non-react-statics')

// TODO Support SFC.  We don't really need a ref to the wrapped component.
export function measure<C extends Measurable>(Wrapped: C): Measured<C> {
    class HOC extends Component<HOCProps<C>> {
        static displayName: string = `Measured<${
            typeof Wrapped === 'string' ?
                Wrapped :
                (Wrapped as ComponentClass).displayName
            }>`

        render() {
            const props: PropsOf<C> = Object.assign(
                {},
                this.props.innerProps,
                {ref: (it: any) => this.updateRef(it)}
            ) as any

            return createElement(
                Wrapped,
                props,
                this.props.children
            )
        }

        private observer: ResizeObserver
        private observing: Maybe<Element>

        constructor(props: HOCProps<C>) {
            super(props)

            this.observer = new ResizeObserver(
                (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
                    const height = entries[0].contentRect.height
                    const width = entries[0].contentRect.width
                    if (existing(this.props.resizeEvents.onHeightChange)) {
                        this.props.resizeEvents.onHeightChange(height)
                    }
                    if (existing(this.props.resizeEvents.onWidthChange)) {
                        this.props.resizeEvents.onWidthChange(width)
                    }
                }
            )
        }

        componentWillUnmount() {
            this.observer.disconnect()
        }

        private updateRef(ref: Maybe<RefOf<C>>) {
            if (existing(this.props.innerRef)) {
                if (typeof this.props.innerRef === 'function') {
                    this.props.innerRef(ref || null) // TODO what's the difference between null and undefined?
                } else if (typeof this.props.innerRef === 'object') {
                    (this.props.innerRef as any).current = ref // FIXME this is probably bad
                } else {
                    throw new Error(`String ref is not supported. Provided value is ${this.props.innerRef}.`)
                }
            }

            if (existing(this.observing)) {
                this.observer.unobserve(this.observing)
                this.observing = nothing
            }

            const dom: Maybe<Element> = assume(ref,
                ref => ref instanceof Element
                    ? ref
                    : findDOMNode(ref) as Element
            )

            if (existing(dom)) {
                this.observer.observe(dom)
                this.observing = dom
            }
        }
    }

    if (typeof Wrapped !== 'string') {
        hoistNonReactStatics(HOC, Component as any)
    }

    return forwardRef<RefOf<C>, PropsOf<C> & ResizeEventProps>((props, innerRef) => {
        const {onHeightChange, onWidthChange, ...innerProps} = props as any // TODO

        return createElement(
            HOC,
            Object.assign(
                {innerProps},
                {innerRef},
                {resizeEvents: {onHeightChange, onWidthChange}}
            ),
            props.children
        )
    })
}

export type HOCProps<C extends Measurable> = {
    innerProps: PropsOf<C>
    innerRef?: Ref<RefOf<C>>
    resizeEvents: ResizeEventProps
}


