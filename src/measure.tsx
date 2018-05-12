///<reference types='resize-observer-polyfill'/>
import {arrayFromNodeList} from '@pinyin/dom'
import {assume, existing, Maybe, notExisting, nothing} from '@pinyin/maybe'
import {EventHandler} from '@pinyin/types'
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
            if (existing(this.props.onResize)) {
                this.props.onResize(entries)
            }
        }
    )

    private attachObserver: MutationObserver = new MutationObserver(
        (mutations: MutationRecord[], observer: MutationObserver) => {
            if (existing(this.observing)) {
                const isDetached = mutations.some(record =>
                    arrayFromNodeList(record.removedNodes).some(node => node === this.observing)
                )
                if (isDetached) {
                    this.resizeObserver.unobserve(this.observing)
                    this.observing = nothing
                }
            }
            if (notExisting(this.observing)) {
                const element = findDOMNode(this) as Element
                if (existing(element)) {
                    this.resizeObserver.observe(element)
                    this.observing = element
                }
            }
        }
    )
}

export type Props = {
    onResize?: EventHandler<Array<ResizeObserverEntry>>
}

export type State = {
    renderingAnchor: boolean
}

