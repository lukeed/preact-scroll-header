import { h, Component } from 'preact';

const EVT = 'scroll';
const doc = document;
const body = doc.body;
let lastScroll, firstReverse;

function attach(el, cb) {
	(el === body ? doc : el).addEventListener(EVT, cb);
}

function noop() {}

export default class ScrollHeader extends Component {
	constructor(props) {
		super(props);

		this.height = 0;
		this.buffer = props.buffer || 0;
		this.parent = props.listenTo || null;

		this.state = {
			isFixed: false,
			isReady: false,
			isShown: false
		};

		this.onScroll = e => {
			const Y = (e.target.body || e.target).scrollTop;

			if (!lastScroll) {
				lastScroll = Y;
			}

			if (Y >= this.height) {
				this.setState({ isFixed: true });
				if (lastScroll <= Y) {
					// reset, is scrolling down
					firstReverse = 0;
					this.setState({ isShown: false });
				} else {
					if ((firstReverse - Y) > this.buffer) {
						this.setState({ isShown: true });
					}
					firstReverse = firstReverse || Y;
				}
				lastScroll = Y;
			} else {
				firstReverse = 0;
				this.setState({ isFixed: false, isShown: false });
			}
		};
	}

	componentDidMount() {
		this.height = this.base.offsetHeight;
		!this.parent && (this.parent = this.base.parentNode);
		!this.props.disabled && attach(this.parent, this.onScroll);
	}

	componentWillReceiveProps(props) {
		const el = this.parent;
		const prev = this.props.disabled;
		// is newly enabled
		(prev && !props.disabled) && attach(el, this.onScroll);
		// is newly disabled
		(!prev && props.disabled) && (el === body ? doc : el).removeEventListener(EVT, this.onScroll);
	}

	shouldComponentUpdate(props, state) {
		const now = this.state;
		return props.disabled !== this.props.disabled
			|| state.isFixed !== now.isFixed
			|| state.isReady !== now.isReady
			|| state.isShown !== now.isShown;
	}

	componentDidUpdate(props, state) {
		const fix = this.state.isFixed;
		const now = this.state.isShown;
		// delay `isReady` application; transition flashing
		(state.isFixed !== fix) && setTimeout(() => this.setState({ isReady: fix }), 1);
		// call user callbacks if `shown` state changed
		if (state.isShown !== now) {
			((now ? props.onShow : props.onHide) || noop).call(this, this.base);
		}
	}

	render(props, state) {
		let cls = props.className || '';

		if (!props.disabled) {
			state.isFixed && (cls += ` ${props.fixClass || 'is--fixed'}`);
			state.isReady && (cls += ` ${props.readyClass || 'is--ready'}`);
			state.isShown && (cls += ` ${props.showClass || 'is--shown'}`);
		}

		return (
			<header id={ props.id } className={ cls }>
				<div>{ props.children }</div>
			</header>
		);
	}
}
