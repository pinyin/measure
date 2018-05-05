# measure

React HOC for measuring the size of a Component

## Install

`npm install @pinyin/measure --save`

It should support TypeScript out of the box. If not, please submit an issue.

## Usage

```typescript jsx
import {measure} from '@pinyin/measure'

class ComponentA extends React.Component { ... }
// or
const ComponentA = 'div'

const ComponentB = measure(ComponentA)
```

`measure()` accepts either a HTML tag name (like `div` and `img`) or a React Component class.

The returned Component will accept all the props from the input component, and a few more: 

```typescript jsx
export type MeasureProps<T> = {
    onHeightChange?: (newHeight: number)=> void
    onWidthChange?: (newWidth: number)=> void
} 
```
`ref` should work as expected.

For example, you can create a component by

```typescript jsx
const Div = measure('div')
```

... and use `Div` just like `div`, but with two more callbacks in props

```typescript jsx
<Div style={xxxx} onClick={xxxx} onHeightChange={xxx} onWidthChange={xxx}>
</Div>
```

Manually created React Component should also work as expected.

## Limits

This component is a thin wrapper around [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill), along with all the limits.

If the wrapped component renders multiple DOM nodes, this HOC will only measure the first node in order.

## License

MIT



