# preact-scroll-header [![NPM](https://img.shields.io/npm/v/preact-scroll-header.svg)](https://www.npmjs.com/package/preact-scroll-header)

> A (800b gzip) header that will show/hide while scrolling; for :atom_symbol: [Preact](https://github.com/developit/preact)

#### [Demo](https://jsfiddle.net/lukeed/kws8r5v4/)

## Install

```
$ npm install --save preact-scroll-header
```

> :exclamation: **Pro Tip:** Use [Yarn](https://yarnpkg.com/) to install dependencies 3x faster than NPM!

```html
<script src="https://unpkg.com/preact-scroll-header@1.0.0/dist/preact-scroll-header.min.js"></script>
```

## Usage

Provide a `value`; everything else is optional.

```js
import { h } from 'preact';
import Progress from 'preact-scroll-header';

onChange = (ctx, val) => console.log(`${val}% complete`);
onComplete = ctx => {ctx.base.style.opacity = 0};

<Progress 
  id="loader" className="loader"
  value={ 16.3 } height="3px" color="#6cc644"
  onChange={ onChange }
  onComplete={ onComplete }
/>
```

## Properties

<!--
#### value
Type: `Number`<br>
Default: `0`<br>
The current progress; between 0 and 100. Mapped to a `style:width` percentage.
-->

#### id
Type: `String`<br>
Default: `none`<br>
The `id` attribute to pass down.

#### className
Type: `String`<br>
Default: `none`<br>
The `className` attribute to pass down. Added to the wrapper element.

## License

MIT © [Luke Edwards](https://lukeed.com)
