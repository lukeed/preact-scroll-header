import { h, Component } from 'preact';

const EVT = 'scroll';
const doc = document;
const body = doc.body;
let lastScroll, firstReverse;

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

		this.onScroll = () => {
			const Y = body.scrollTop;

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
		let el = this.parent;
		this.height = this.base.offsetHeight;
		!el && (this.parent = el = this.base.parentNode);
		if (!this.props.disabled) {
			(el === body ? doc : el).addEventListener(EVT, this.onScroll);
		}
	}

	componentWillReceiveProps(props) {
		const el = this.parent;
		const prev = this.props.disabled;
		// is newly disabled
		if (!prev && props.disabled) {
			(el === body ? doc : el).removeEventListener(EVT, this.onScroll);
		}
		// is newly enabled
		if (prev && !props.disabled) {
			(el === doc.body ? doc : el).addEventListener(EVT, this.onScroll);
		}
	}

	shouldComponentUpdate(props, state) {
		const now = this.state;
		return props.disabled !== this.props.disabled
			|| state.isFixed !== now.isFixed
			|| state.isReady !== now.isReady
			|| state.isShown !== now.isShown;
	}

	componentDidUpdate(props, state) {
		const now = this.state.isFixed;
		// delay `isReady` application; transition flashing
		(state.isFixed !== now) && setTimeout(() => this.setState({ isReady: now }), 1);
		// call user callbacks if `shown` state changed
		if (state.isShown !== this.state.isShown) return (isShown ? props.onShow : props.onHide).call(this, this.base);
	}

	render(props, state) {
		let cls = props.className;

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
