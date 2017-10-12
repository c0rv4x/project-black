import _  from 'lodash'
import React from 'react'
import { Button, InputGroup, Input } from 'reactstrap'

import ProjectsList from "../presentational/ProjectsList.jsx"


class ProjectsMain extends React.Component
{

	constructor(props) {
		super(props);

	}

	render() {
		return (
            <div>
                <h2>Projects</h2>
                <br/>
                <InputGroup>
                    <Input placeholder="Project Name"
                           type="text"
                           value={this.props.newProjectName}
                           onChange={(e) => this.props.onProjectNameChange(e.target.value)} />
                </InputGroup>
                <br/>

                <Button color="primary" onClick={this.props.submitNewProject}>Add new</Button>

                <ProjectsList projects={this.props.projects} onDelete={this.props.onDelete}/>

            </div>
		)
	}

}

export default ProjectsMain;
