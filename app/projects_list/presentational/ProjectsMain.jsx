import _  from 'lodash'
import React from 'react'
import { Button, Input, Header } from 'semantic-ui-react'

import ProjectsList from "../presentational/ProjectsList.jsx"


class ProjectsMain extends React.Component
{

	constructor(props) {
		super(props);

	}

	render() {
		return (
            <div>
                <br/>
                <Header as="h2">Projects</Header>
                <Input fluid
                       placeholder="Project Name"
                       type="text"
                       value={this.props.newProjectName}
                       onChange={(e) => this.props.onProjectNameChange(e.target.value)} />
                <br/>

                <Button color="blue" onClick={this.props.submitNewProject}>Add new</Button>

                <ProjectsList projects={this.props.projects} onDelete={this.props.onDelete}/>

            </div>
		)
	}

}

export default ProjectsMain;
