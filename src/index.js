import { h, Component } from 'preact';

const EVT = 'scroll';
let lastScroll, firstReverse;

export default class ScrollHeader extends Component {
	constructor(props) {
		super(props);

		this.height = 0;
		this.buffer = props.buffer || 0;
		this.parent = props.listenTo || null;

		this.state = { isFixed: false };

		this.onScroll = e => {
			const Y = e.target.scrollTop;

			if (!lastScroll) {
				lastScroll = Y;
			}

			if (Y >= this.height) {
				if (lastScroll <= Y) {
					// reset, is scrolling down
					this.setState({ isFixed: false });
				} else {
					if ((firstReverse - Y) > this.buffer) {
						this.setState({ isFixed: true });
					}
					firstReverse = firstReverse || Y;
				}
				lastScroll = Y;
				// console.log('ALSO RESET, DOWN');
				// this.setState({ isFixed: false });
			} else {
				firstReverse = 0;
				this.setState({ isFixed: false });
			}
		};
	}

	componentDidMount() {
		this.height = this.base.offsetHeight;
		!this.parent && (this.parent = this.base.parentNode);
		!this.props.disabled && this.parent.addEventListener(EVT, this.onScroll);
	}

	componentWillReceiveProps({ disabled }) {
		const prev = this.props.disabled;
		// is newly disabled, "unfix"
		(!prev && disabled) && this.parent.removeEventListener(EVT, this.onScroll);
		// is newly enabled
		(prev && !disabled) && this.parent.addEventListener(EVT, this.onScroll)
	}

	shouldComponentUpdate() {
		console.log('~~~~~~~~~~ inside scu ~~~~~~~~~~');
	}

	componentDidUpdate({ onPin, onUnpin }, { isFixed }) {
		const now = this.state.isFixed;
		if (isFixed !== now) return (now ? onPin : onUnpin).call(this, this.base);
	}

	render({ id, className, children, fixClass }, { isFixed }) {
		return (
			<header id={ id } className={ className }>
				<div>{ children }</div>
			</header>
		);
	}
}
