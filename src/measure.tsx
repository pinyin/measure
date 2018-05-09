import {arrayFromNodeList} from '@pinyin/dom'
import {assume, existing, Maybe, notExisting, nothing} from '@pinyin/maybe'
import {EventHandler, px} from '@pinyin/types'
import {default as React} from 'react'
import {findDOMNode} from 'react-dom'
import ResizeObserver from 'resize-observer-polyfill'

export class Measure extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {renderingAnchor: false}
    }

    render() {
        const {renderingAnchor} = this.state
        const {children} = this.props

        return renderingAnchor ?
            <div style={{display: 'none'}}/> :
            children
    }

    componentDidMount() {
        const root = findDOMNode(this) as Element // FIXME Text node?
        const parent = assume(root, it => it.parentElement)
        if (existing(parent)) {
            this.attachObserver.observe(parent, {childList: true, subtree: false})
            this.resizeObserver.observe(root)
            this.observing = root
        } else {
            this.setState({renderingAnchor: true})
        }
    }

    componentDidUpdate() {
        const {renderingAnchor} = this.state
        if (renderingAnchor) {
            const root = findDOMNode(this) as Element // FIXME
            const parent = assume(root, it => it.parentElement)
            if (notExisting(parent)) {
                throw new Error('Component does not render a DOM Node')
            }

            this.attachObserver.observe(parent, {childList: true, subtree: false})
            this.setState({renderingAnchor: false})
        }
    }

    componentWillUnmount() {
        this.resizeObserver.disconnect()
        this.attachObserver.disconnect()
    }

    private observing: Maybe<Element>

    private resizeObserver: ResizeObserver = new ResizeObserver(
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

    private attachObserver: MutationObserver = new MutationObserver(
        (mutations: MutationRecord[], observer: MutationObserver) => {
            const {observing} = this
            if (existing(observing)) {
                const isDetached = mutations.some(record =>
                    arrayFromNodeList(record.removedNodes).some(node => node === observing)
                )
                if (!isDetached) { return }
                this.resizeObserver.unobserve(observing)
                this.observing = nothing
            } else {
                const element = findDOMNode(this) as Element
                if (notExisting(element)) { return }
                this.resizeObserver.observe(element)
                this.observing = element
            }
        }
    )
}

export type Props = {
    onHeightChange?: EventHandler<px>
    onWidthChange?: EventHandler<px>
}

export type State = {
    renderingAnchor: boolean
}
