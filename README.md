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

The returned Component will accept the same props as input component, and a few more props: 

```typescript jsx
export type MeasureProps<T> = {
    onHeightChange?: (newHeight: number)=> void
    onWidthChange?: (newWidth: number)=> void
    innerRef?: (ref: T) => void;
} 
```
Use `innerRef` to get a `HTMLElement` (when the corresponding input of `measure()` is a string) or a React Component instance (when the input is a React Component class).
Only function ref is supported at this moment. Please submit an issue if you need more options.

For example, you can easily create a component by

```typescript jsx
const Div = measure('div')
```

... and use `Div` just like `div`, but with two new callbacks in props

```typescript jsx
<Div style={xxxx} onClick={xxxx} onHeightChange={xxx} onWidthChange={xxx}>
</Div>
```

Manually created React Component should also work as expected.

## Limits

This component is a thin wrapper around [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill), with all the limits included.

If the wrapped component returns multiple DOM nodes, this HOC will measure the first one.

## License

MIT



