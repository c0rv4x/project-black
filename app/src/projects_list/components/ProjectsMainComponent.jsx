import React from 'react'
import PropTypes from 'prop-types'

import ProjectsMain from '../presentational/ProjectsMain.jsx'
import ProjectsSocketioEventsEmitter from '../../redux/projects/ProjectsSocketioEventsEmitter.js'

import {
	fetchProjects,
	submitNewProject
} from '../../redux/projects/actions.js'



class ProjectsMainComponent extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"newProjectName": ""
		}

		this.changeNewProjectName = this.changeNewProjectName.bind(this);
		this.createProject = this.createProject.bind(this);
	}

	componentDidMount() {
		this.emitter = new ProjectsSocketioEventsEmitter();
		this.context.store.dispatch(fetchProjects());
	}

	changeNewProjectName(newName) {
		this.setState({
			"newProjectName": newName
		});
	}

	createProject(projectName) {
		this.context.store.dispatch(submitNewProject(projectName));
	}

	render() {
		return (
			<ProjectsMain projects={this.props.projects}
						  onDelete={(project_uuid) => this.emitter.requestDeleteProject(project_uuid)} 

						  submitNewProject={(new_name) => this.createProject(new_name.trim())}
			/>
		)
	}
}

ProjectsMainComponent.contextTypes = {
    store: PropTypes.object
}



export default ProjectsMainComponent
