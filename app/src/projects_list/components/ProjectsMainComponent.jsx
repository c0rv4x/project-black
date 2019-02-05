import React from 'react'
import PropTypes from 'prop-types'

import ProjectsMain from '../presentational/ProjectsMain.jsx'

import {
	submitNewProject,
	submitDeleteProject
} from '../../redux/projects/actions.js'



class ProjectsMainComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"newProjectName": ""
		}

		this.changeNewProjectName = this.changeNewProjectName.bind(this);
		this.createProject = this.createProject.bind(this);
		this.deleteProject = this.deleteProject.bind(this);
	}

	changeNewProjectName(newName) {
		this.setState({
			"newProjectName": newName
		});
	}

	createProject(projectName) {
		this.context.store.dispatch(submitNewProject(projectName));
	}

	deleteProject(projectUUID) {
		this.context.store.dispatch(submitDeleteProject(projectUUID));
	}

	render() {
		return (
			<ProjectsMain projects={this.props.projects}
						  onDelete={(project_uuid) => this.deleteProject(project_uuid)} 

						  submitNewProject={(new_name) => this.createProject(new_name.trim())}
			/>
		)
	}
}

ProjectsMainComponent.contextTypes = {
    store: PropTypes.object
}



export default ProjectsMainComponent
