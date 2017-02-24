import { h, Component } from 'preact';

const EVT = 'scroll';
const body = document.body;
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
		this.height = this.base.offsetHeight;
		!this.parent && (this.parent = this.base.parentNode);
		if (!this.props.disabled) {
			addEventListener(EVT, this.onScroll);
			// this.parent.addEventListener(EVT, this.onScroll);
		}
	}

	componentWillReceiveProps({ disabled }) {
		const prev = this.props.disabled;
		// is newly disabled, "unfix"
		(!prev && disabled) && this.parent.removeEventListener(EVT, this.onScroll);
		// is newly enabled
		(prev && !disabled) && this.parent.addEventListener(EVT, this.onScroll)
	}

	shouldComponentUpdate(props, state) {
		const now = this.state;
		return props.disabled !== this.props.disabled
			|| state.isFixed !== now.isFixed
			|| state.isReady !== now.isReady
			|| state.isShown !== now.isShown;
	}

	componentDidUpdate({ onShow, onHide }, { isFixed, isShown }) {
		const now = this.state.isFixed;
		// delay `isReady` application; transition flashing
		(isFixed !== now) && setTimeout(() => this.setState({ isReady: now }), 1);
		// call user callbacks if `shown` state changed
		if (isShown !== this.state.isShown) return (isShown ? onShow : onHide).call(this, this.base);
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
