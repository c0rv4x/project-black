import React from 'react'

import ProjectsMain from '../presentational/ProjectsMain.jsx'
import ProjectsSocketioEventsEmitter from '../../redux/projects/ProjectsSocketioEventsEmitter.js'


class ProjectsMainComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"newProjectName": ""
		}

		this.changeNewProjectName = this.changeNewProjectName.bind(this);
	}

	componentDidMount() {
		this.emitter = new ProjectsSocketioEventsEmitter();
	}

	changeNewProjectName(newName) {
		this.setState({
			"newProjectName": newName
		});
	}

	render() {
		return (
			<ProjectsMain projects={this.props.projects}
						  onDelete={(project_uuid) => this.emitter.requestDeleteProject(project_uuid)} 

						  newProjectName={this.state.newProjectName}
						  onProjectNameChange={this.changeNewProjectName}
						  submitNewProject={() => this.emitter.requestCreateProject(this.state.newProjectName.trim())}/>
		)
	}
}



export default ProjectsMainComponent
