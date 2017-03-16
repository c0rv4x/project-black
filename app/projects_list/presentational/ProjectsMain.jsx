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

                        <ProjectInput />
                    </FormGroup>
                </form>

                <Button bsStyle="primary" onClick={this.create}>Add new</Button>

                <ProjectsList projects={this.props.projects} />
            </div>
		)
	}

}

export default ProjectsMain;
