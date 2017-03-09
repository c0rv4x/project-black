import React from 'react';
import {render} from 'react-dom';

import ProjectList from './projects_list/ProjectList.jsx';
class App extends React.Component {
	render () {
		return (
			<div>
			<h1>Project Black</h1>
			<ProjectList />
			</div>
		);
	}
}

render(<App/>, document.getElementById('app'));