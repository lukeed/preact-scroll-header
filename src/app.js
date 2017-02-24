import { h, render } from 'preact';
import ScrollHeader from './index';

render((
	<div className="demo">
    <ScrollHeader
    	buffer={ 20 }
    	className="demo-header"
    	onPin={ () => console.log('PIN') }
    	onUnpin={ () => console.log('UNPIN') }
    	>
      <h1>Menu</h1>
    </ScrollHeader>

    <article>
      {
      	Array(8).fill().map(() => (
      		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores sed officiis ut incidunt non dolorem, nisi voluptate. Provident sed officia iste tenetur asperiores totam expedita aut. Vel minima beatae ipsa!</p>
        ))
      }
    </article>
  </div>
), document.body);
