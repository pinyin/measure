# measure

React HOC for measuring the size of a Component

## Install

`npm install @pinyin/measure --save`

## Usage

`measure(ComponentA): ComponentB`

ComponentA can be either a string(like `div` and `img`) or a React Component class.

The returned `ComponentB` will accept the same props as ComponentA, and the following more: 

```typescript jsx
export type MeasureProps<T> = {
    onHeightChange?: (newHeight: number)=> void
    onWidthChange?: (newWidth: number)=> void
    innerRef?: (ref: T) => void;
} 
```
Only functional ref is supported at this moment. Please submit an issue if you need more options.

For example, you may easily create a component by

```typescript jsx
const Div = measure('div')
```

... and use `Div` just like `div`, but with two added callbacks in props

```typescript jsx
<Div style={xxxx} onClick={xxxx} onHeightChange={xxx} onWidthChange={xxx}>
</Div>
```

Custom created React Component should also work as expected.

## License

MIT



