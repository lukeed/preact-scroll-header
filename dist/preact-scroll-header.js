(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('preact')) :
	typeof define === 'function' && define.amd ? define(['preact'], factory) :
	(global.ScrollHeader = factory(global.preact));
}(this, (function (preact) { 'use strict';

var EVT = 'scroll';
var doc = document;
var body = doc.body;
var lastScroll;
var firstReverse;

function attach(el, cb) {
	(el === body ? doc : el).addEventListener(EVT, cb);
}

function noop() {}

var ScrollHeader = (function (Component$$1) {
	function ScrollHeader(props) {
		var this$1 = this;

		Component$$1.call(this, props);

		this.height = 0;
		this.buffer = props.buffer || 0;
		this.parent = props.listenTo || null;

		this.state = {
			isFixed: false,
			isReady: false,
			isShown: false
		};

		this.onScroll = function (e) {
			var Y = (e.target.body || e.target).scrollTop;

			if (!lastScroll) {
				lastScroll = Y;
			}

			if (Y >= this$1.height) {
				this$1.setState({ isFixed: true });
				if (lastScroll <= Y) {
					// reset, is scrolling down
					firstReverse = 0;
					this$1.setState({ isShown: false });
				} else {
					if ((firstReverse - Y) > this$1.buffer) {
						this$1.setState({ isShown: true });
					}
					firstReverse = firstReverse || Y;
				}
				lastScroll = Y;
			} else {
				firstReverse = 0;
				this$1.setState({ isFixed: false, isShown: false });
			}
		};
	}

	if ( Component$$1 ) ScrollHeader.__proto__ = Component$$1;
	ScrollHeader.prototype = Object.create( Component$$1 && Component$$1.prototype );
	ScrollHeader.prototype.constructor = ScrollHeader;

	ScrollHeader.prototype.componentDidMount = function componentDidMount () {
		this.height = this.base.offsetHeight;
		!this.parent && (this.parent = this.base.parentNode);
		!this.props.disabled && attach(this.parent, this.onScroll);
	};

	ScrollHeader.prototype.componentWillReceiveProps = function componentWillReceiveProps (props) {
		var el = this.parent;
		var prev = this.props.disabled;
		// is newly enabled
		(prev && !props.disabled) && attach(el, this.onScroll);
		// is newly disabled
		(!prev && props.disabled) && (el === body ? doc : el).removeEventListener(EVT, this.onScroll);
	};

	ScrollHeader.prototype.shouldComponentUpdate = function shouldComponentUpdate (props, state) {
		var now = this.state;
		return props.disabled !== this.props.disabled
			|| state.isFixed !== now.isFixed
			|| state.isReady !== now.isReady
			|| state.isShown !== now.isShown;
	};

	ScrollHeader.prototype.componentDidUpdate = function componentDidUpdate (props, state) {
		var this$1 = this;

		var fix = this.state.isFixed;
		var now = this.state.isShown;
		// delay `isReady` application; transition flashing
		(state.isFixed !== fix) && setTimeout(function () { return this$1.setState({ isReady: fix }); }, 1);
		// call user callbacks if `shown` state changed
		if (state.isShown !== now) {
			((now ? props.onShow : props.onHide) || noop).call(this, this.base);
		}
	};

	ScrollHeader.prototype.render = function render (props, state) {
		var cls = props.className;

		if (!props.disabled) {
			state.isFixed && (cls += " " + (props.fixClass || 'is--fixed'));
			state.isReady && (cls += " " + (props.readyClass || 'is--ready'));
			state.isShown && (cls += " " + (props.showClass || 'is--shown'));
		}

		return (
			preact.h( 'header', { id: props.id, className: cls },
				preact.h( 'div', null, props.children )
			)
		);
	};

	return ScrollHeader;
}(preact.Component));

return ScrollHeader;

})));
