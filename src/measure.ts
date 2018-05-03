import {assume, existing, Maybe, nothing} from '@pinyin/maybe'
import {PropsOf, Referable, RefOf} from '@pinyin/react'
import {Component, ComponentClass, createElement} from 'react'
import {findDOMNode} from 'react-dom'
import ResizeObserver from 'resize-observer-polyfill'
import {Measured} from './Measured'
import {MeasureProps} from './MeasureProps'
import hoistNonReactStatics = require('hoist-non-react-statics')

// TODO
// 1. Make use of React.forwardRef
// 2. Support SFC.  We don't really need a ref to the wrapped component.
export function measure<C extends Referable>(Wrapped: C): Measured<C> {
    class HOC extends Component<PropsOf<C> & MeasureProps<C>> {
        static displayName: string = `Measured<${
            typeof Wrapped === 'string' ?
                Wrapped :
                (Wrapped as ComponentClass).displayName
            }>`

        render() {
            // TODO what if Component renders multiple elements?

            const props: PropsOf<C> = Object.assign(
                {},
                this.props,
                {ref: (it: any) => this.updateRef(it)}
            ) as any
            delete props['onHeightChange']
            delete props['onWidthChange']
            delete props['innerRef']

            return createElement(
                Wrapped as any,
                props,
                this.props.children
            )
        }

        private observer: ResizeObserver
        private observing: Maybe<Element>

        constructor(props: PropsOf<C> & MeasureProps<C>) {
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
            const callback: any = this.props.innerRef
            if (existing(callback) && typeof callback === 'function') {
                callback(ref)
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

    return HOC
}


