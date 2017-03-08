import React from 'react';
import {render} from 'react-dom';

import Project from './projects_list/Project.jsx';
class App extends React.Component {
	render () {
		return (
			<div>
			<p> Hello React!</p>
			<Project projectName="123"/>
			</div>
		);
	}
}

render(<App/>, document.getElementById('app'));