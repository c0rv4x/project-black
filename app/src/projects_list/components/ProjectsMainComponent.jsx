import React from 'react'
import PropTypes from 'prop-types'

import ProjectsMain from '../presentational/ProjectsMain.jsx'
import ProjectsSocketioEventsEmitter from '../../redux/projects/ProjectsSocketioEventsEmitter.js'

import { fetchProjects } from '../../redux/projects/actions.js'



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
		this.context.store.dispatch(fetchProjects());
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

						  submitNewProject={(new_name) => this.emitter.requestCreateProject(new_name.trim())}
			/>
		)
	}
}

ProjectsMainComponent.contextTypes = {
    store: PropTypes.object
}



export default ProjectsMainComponent
