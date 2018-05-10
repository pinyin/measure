# measure

React component for measuring the size of a component

## Install

`npm install @pinyin/measure --save`

It should support TypeScript out of the box. If not, please submit an issue.

## Usage

```typescript jsx
import {Measure} from '@pinyin/measure'

<Measure onHeightChange={(newHeight: number)=> xxxx} onWidthChange={(newWidth: number)=> xxxx}>
   <AnyMeasuredComponent/> // only the first DOM node is measured
</Measure>

```

This component does not affect DOM structure.

Unlike many other solutions, this component will auto find another measuring target after the previous target was detached from document.

## Limits & Known Issues

This component is a thin wrapper around [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill), along with all the limits.

All children are rendered, but only the first DOM node in children is measured, so it's best to provide `<Measure/>` with a single child.

Portals in children components are not supported.

Once this component found a measurable node (the first and topmost DOM node rendered by its children), it will not change measuring target until the previous target is removed from document.

Text nodes as measuring targets are not supported yet and may cause unexpected behavior.

## License

MIT



