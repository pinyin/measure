# measure

React component for measuring the size of a Component

## Install

`npm install @pinyin/measure --save`

It should support TypeScript out of the box. If not, please submit an issue.

## Usage

```typescript jsx
import {Measure} from '@pinyin/measure'

<Measure onHeightChange={(newHeight: number)=> xxxx} onWidthChange={(newWidth: px)=> xxxx}>
   <AnyMeasuredComponent/> // only the first DOM node is measured
</Measure>

```

This component does not do anything to the DOM structure.

## Limits

This component is a thin wrapper around [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill), along with all the limits.

All children are rendered, but only the first DOM node in children is measured, so it's best to provide `<Measure/>` with a single child.

Portals in children components are not supported.

## License

MIT



