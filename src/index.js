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
			console.log('inside', Y);

			if (!lastScroll) {
				lastScroll = Y;
			}

			if (Y >= this.height) {
				this.setState({ isFixed: true });
				if (lastScroll <= Y) {
					// reset, is scrolling down
					this.setState({ isShown: false });
				} else {
						console.log('UP');
					if ((firstReverse - Y) > this.buffer) {
						console.log('REVEAL');
						this.setState({ isShown: true });
					}
					firstReverse = firstReverse || Y;
				}
				lastScroll = Y;
				console.log('ALSO RESET, DOWN');
				// this.setState({ isShown: false });
			} else {
				firstReverse = 0;
				this.setState({ isFixed: false, isShown: false });
			}
		};
	}

	componentDidMount() {
		this.height = this.base.offsetHeight;
		!this.parent && (this.parent = this.base.parentNode);
		console.log(this.parent, this.height, this.props.disabled);
		if (!this.props.disabled) {
			console.log('attaching listener to', this.parent);
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

	shouldComponentUpdate() {
		console.log('~~~~~~~~~~ inside scu ~~~~~~~~~~');
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
