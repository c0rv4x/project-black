import React from 'react'
import { Button, Input } from 'react-bootstrap';


class ProjectDetailsPage extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h2>Project project_name </h2>

				<FormGroup>
					<Label for="projectComment">Comment</Label>
					<Input type="text" id="projectComment" />
					<FormText color="muted">
					Go ahead and write some notes for yourself.
					</FormText>
				</FormGroup>
			</div>

		)
	}

}


export default ProjectDetailsPage;