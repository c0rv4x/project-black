import React from 'react';
import {render} from 'react-dom';

import ProjectList from './projects_list/ProjectList.jsx';
class App extends React.Component {
	render () {
		return (
			<div>
			<p> Hello React!</p>
			<ProjectList />
			</div>
		);
	}
}

render(<App/>, document.getElementById('app'));