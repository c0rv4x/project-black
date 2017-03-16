import _  from 'lodash';
import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import ProjectsList from "../presentational/ProjectsList.jsx";
import ProjectInput from "../presentational/ProjectInput.jsx";


class ProjectsMain extends React.Component
{

	constructor(props) {
		super(props);
	}

	render() {
		return (
            <div>
                <h2>Projects</h2>

                <form>
                    <FormGroup>
                        <ControlLabel>Create new project or select the existing</ControlLabel>

                        <ProjectInput newProjectName={this.props.newProjectName}
                                      onProjectNameChange={this.props.onProjectNameChange} />
                    </FormGroup>
                </form>

                <Button bsStyle="primary" onClick={this.props.submitNewProject}>Add new</Button>

                <ProjectsList projects={this.props.projects} onDelete={this.props.onDelete}/>
            </div>
		)
	}

}

export default ProjectsMain;
