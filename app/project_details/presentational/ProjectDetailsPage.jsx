import React from 'react'

import ProjectComment from './ProjectComment.jsx';
import ProjectScope from './ProjectScope.jsx';

class ProjectDetailsPage extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h2>Project project_name </h2>
				<br />
				<ProjectComment />
				<hr />
				<ProjectScope />
			</div>
		)
	}

}


export default ProjectDetailsPage;