import {assume, existing, Maybe, nothing} from '@pinyin/maybe'
import {forwardInnerRef, PropsOf, RefOf} from '@pinyin/react'
import {Component, ComponentClass, createElement} from 'react'
import {findDOMNode} from 'react-dom'
import ResizeObserver from 'resize-observer-polyfill'
import {Measurable} from './Measurable';
import {Measured} from './Measured';
import {ResizeEvents} from './ResizeEvents'
import hoistNonReactStatics = require('hoist-non-react-statics')

// TODO Support SFC.  We don't really need a ref to the wrapped component.
export function measure<C extends Measurable>(Wrapped: C): Measured<C> {
    class HOC extends Component<PropsOf<C> & ResizeEvents> {
        static displayName: string = `Measured<${
            typeof Wrapped === 'string' ?
                Wrapped :
                (Wrapped as ComponentClass).displayName
            }>`

        render() {
            const props: PropsOf<C> = Object.assign(
                {},
                this.props,
                {ref: (it: any) => this.updateRef(it)}
            ) as any
            delete props['innerRef']
            delete props['onHeightChange']
            delete props['onWidthChange']

            return createElement(
                Wrapped,
                props,
                this.props.children
            )
        }

        private observer: ResizeObserver
        private observing: Maybe<Element>

        constructor(props: PropsOf<C> & ResizeEvents) {
            super(props)

            this.observer = new ResizeObserver(
                (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
                    const height = entries[0].contentRect.height
                    const width = entries[0].contentRect.width
                    if (existing(this.props.onHeightChange)) {
                        this.props.onHeightChange(height)
                    }
                    if (existing(this.props.onWidthChange)) {
                        this.props.onWidthChange(width)
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

    return forwardInnerRef(HOC)
}

