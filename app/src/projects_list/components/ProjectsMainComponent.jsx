import React from 'react'

import ProjectsMain from '../presentational/ProjectsMain.jsx'
import ProjectsSocketioEventsEmitter from '../../redux/projects/ProjectsSocketioEventsEmitter.js'


class ProjectsMainComponent extends React.Component {

	constructor(props) {
		super(props);

		this.emitter = new ProjectsSocketioEventsEmitter();
	}

	render() {
		return (
			<ProjectsMain projects={this.props.projects}
						  onDelete={(project_uuid) => this.emitter.requestDeleteProject(project_uuid)} 

						  submitNewProject={(new_name) => this.emitter.requestCreateProject(new_name.trim())}
			/>
		)
	}
}



export default ProjectsMainComponent
