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
import ScrollHeader from 'preact-scroll-header';

<ScrollHeader
  id="header" className="menu"
  buffer={ 24 } showClass="menu-show"
  onShow={ el => console.log('SHOWN', el) }
  onHide={ el => console.log('HIDDEN', el) }>
  <h1>Menu</h1>
</ScrollHeader>
```

## Styles

This component does not include any inline styles. Instead, classnames are assigned for every state the `<ScrollHeader/>` enters. This provides greater flexibility and control of your desired effects! 

However, there are some strong guidelines which you should not neglect. Below is an example for a simple slide-down effect:

```css
/* start with "shown" position */
/* will-change, top, right, left early to avoid extra repaints */
.header {
  position: relative;
  will-change: transform;
  transform: translateY(0%);
  right: 0;
  left: 0;
  top: 0;
}

/* apply fixed; set start point */
.is--fixed {
  position: fixed;
  transform: translateY(-100%);
}

/* apply transition separately; no flicker */
.is--ready {
  transition: transform 0.2s ease-in-out;
}

/* set end point; with shadow */
.is--shown {
  transform: translateY(0%);
  box-shadow: 0 3px 6px rgba(0,0,0, 0.16);
}
```

> **Note:** Assumes that "header" was added as your base `className`. All others are defaults.


## Properties

#### id
Type: `String`<br>
Default: `none`

The `id` attribute to pass down.

#### className
Type: `String`<br>
Default: `none`

The `className` attribute to pass down. Added to the wrapper element.

#### fixClass
Type: `String`<br>
Default: `'is--fixed'`

The `className` to add when the header is out of view. This should apply a `position:fixed` style, as well as an initial `transform` value.

#### readyClass
Type: `String`<br>
Default: `'is--ready'`

The `className` to add when the header has been "fixed". This should apply a `transition` value to your header, which should always be separated from your [`fixClass`](#fixClass).

> **Note:** Applying a `transition` _before_ this class (via base style or `fixClass`) will cause the `<ScrollHeader/>` to flicker into view before hiding.

#### showClass
Type: `String`<br>
Default: `'is--shown'`

The `className` to add when the header should be revealed. This should apply your desired `transform` effect. Class is only applied when the `<ScrollHeader/>` is out of view and has been "fixed".

#### buffer
Type: `Number`<br>
Default: `0`

The number of pixels to scroll before applying your [`showClass`](#showClass). By default, the `<ScrollHeader/>` will be shown immediately after user scrolls up.

#### listenTo
Type: `String`<br>
Default: `this.base.parentNode`

The "scroller" element that will fire `scroll` events. Works well with customized viewports, where `document.body` is not scrollable and/or controlling overflow.

#### disabled
Type: `Boolean`<br>
Default: `false`

Whether or not to disable the show/hide behavior. If `true`, **will not** add `fixClass`, `readyClass`, or `showClass`.

#### onShow
Type: `Function`

The callback function when the header is to be shown. Receivies the DOM element as its only argument, but is bound to the `ScrollHeader` component context.

#### onHide
Type: `Function`

The callback function when the header is to be hidden. Receivies the DOM element as its only argument, but is bound to the `ScrollHeader` component context.


## License

MIT © [Luke Edwards](https://lukeed.com)
