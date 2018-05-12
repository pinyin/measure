# measure

React component for measuring the size of a component

## Install

`npm install @pinyin/measure --save`

It should support TypeScript out of the box. If not, please submit an issue.

## Usage

```typescript jsx
import {Measure} from '@pinyin/measure'

<Measure onResize={(resizeObserverEntryArray)=> xx}>
   <AnyMeasuredComponent/> // only the first DOM node is measured
</Measure>

```

`onResize` receives an array of `ResizeObserverEntry`

```typescript jsx
interface ResizeObserverEntry {
    readonly target: Element;
    readonly contentRect: DOMRectReadOnly;
}

interface DOMRectReadOnly {
    readonly bottom: number;
    readonly height: number;
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly width: number;
    readonly x: number;
    readonly y: number;
}
``` 

This component does not affect DOM structure.

Unlike many other solutions, this component will auto find another measuring target after the previous target was detached from document.

## Limits & Known Issues

This component is a thin wrapper around [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill), along with all the limits.

All children are rendered, but only the first DOM node in children is measured, so it's best to provide `<Measure/>` with a single child.

Portals in children components are not supported.

Once this component found a measurable node (the first and topmost DOM node rendered by its children), it will not change measuring target until the previous target is removed from document.

Text nodes as measuring targets are not supported yet and may cause unexpected behavior.

## Plan

Support measuring multiple DOM nodes.

## License

MIT



