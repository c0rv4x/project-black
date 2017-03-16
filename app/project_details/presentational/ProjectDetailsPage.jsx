import React from 'react'

import ProjectComment from './ProjectComment.jsx';

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
			</div>
		)
	}

}


export default ProjectDetailsPage;