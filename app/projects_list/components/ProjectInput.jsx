import _  from 'lodash';
import React from 'react';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import ProjectsList from "./ProjectsList.jsx";

class ProjectInput extends React.Component
{

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<FormControl placeholder="Project Name"
		                 type="text"
		                 value="here will be project name"/*{TODO: add param}
		                 onChange={/*TODO: add function}*//>
		)
	}

}

export default ProjectInput;


                        