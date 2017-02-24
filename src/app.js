import { h, render } from 'preact';
import ScrollHeader from './index';

const DATA = []; // staic data
for (let x=100; x--; ) DATA[x] = `Item #${x+1}`;

render((
	<div className="demo">
		<ScrollHeader
			className="demo-header"
			onShow={ () => console.log('PIN') }
			onHide={ () => console.log('UNPIN') }>
			<h1>Menu</h1>
		</ScrollHeader>

		<ul>
			{ DATA.map(e => <li>{ e }</li>) }
		</ul>
	</div>
), document.body);
