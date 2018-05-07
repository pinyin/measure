import {existing} from '@pinyin/maybe'
import {forwardInnerRef, PropsOf, RefOf} from '@pinyin/react'
import {Component, ComponentClass, createElement, Ref} from 'react'
import {findDOMNode} from 'react-dom'
import ResizeObserver from 'resize-observer-polyfill'
import {Measurable} from './Measurable';
import {Measured} from './Measured';
import {ResizeEvents} from './ResizeEvents'
import hoistNonReactStatics = require('hoist-non-react-statics')

// TODO Support SFC.  We don't really need a ref to the wrapped component.
export function measure<C extends Measurable>(Wrapped: C): Measured<C> {
    class HOC extends Component<PropsOf<C> & ResizeEvents & { innerRef: Ref<RefOf<C>> }> {
        static displayName: string = `Measured<${
            typeof Wrapped === 'string' ?
                Wrapped :
                (Wrapped as ComponentClass).displayName
            }>`

        render() {
            const props: PropsOf<C> = Object.assign(
                {},
                this.props,
                {ref: this.props.innerRef}
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

        componentDidMount() {
            const root = findDOMNode(this) as Element // FIXME
            this.observer.observe(root)
        }

        componentWillUnmount() {
            this.observer.disconnect()
        }

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

        private observer: ResizeObserver
    }

    if (typeof Wrapped !== 'string') {
        hoistNonReactStatics(HOC, Component as any)
    }

    return forwardInnerRef(HOC)
}

