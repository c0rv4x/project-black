import React from 'react';

import ProjectsMain from '../presentational/ProjectsMain.jsx';
import ProjectsSocketioEventsEmitter from '../../common/ProjectsSocketioEventsEmitter.js';


class ProjectsMainComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"newProjectName": ""
		}

		this.emitter = new ProjectsSocketioEventsEmitter();

		this.changeNewProjectName = this.changeNewProjectName.bind(this);
	}

	changeNewProjectName(newName) {
		this.setState({
			"newProjectName": newName
		});
	}

	render() {
		return (
			<ProjectsMain projects={this.props.projects}
						  onDelete={(project_uuid) => this.emitter.deleteProject(project_uuid)} 

						  newProjectName={this.state.newProjectName}
						  onProjectNameChange={this.changeNewProjectName}
						  submitNewProject={() => this.emitter.createProject(this.state.newProjectName)}/>
		)
	}
}



export default ProjectsMainComponent