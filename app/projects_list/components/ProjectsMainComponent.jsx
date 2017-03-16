import React from 'react';

import ProjectsMain from '../presentational/ProjectsMain.jsx';
import ProjectsSocketioEventsEmitter from '../../common/ProjectsSocketioEventsEmitter.js';

class ProjectsMainComponent extends React.Component {

	constructor(props) {
		super(props);

		this.emitter = new ProjectsSocketioEventsEmitter();
	}

	render() {
		return (
			<ProjectsMain projects={this.props.projects}
						  onDelete={(project_uuid) => this.emitter.deleteProject(project_uuid)} />
		)
	}
}



export default ProjectsMainComponent