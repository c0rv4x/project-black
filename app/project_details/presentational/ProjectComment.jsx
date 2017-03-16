import React from 'react'
import { 
	Button,
	FormGroup,
	ControlLabel,
	FormControl,
	HelpBlock 
} from 'react-bootstrap';


class ProjectComment extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<form>
				<FormGroup>
					<FormGroup>
						<ControlLabel>Comment</ControlLabel>

						<FormControl componentClass="textarea" placeholder="
						Enter some data to help yourself in further." />
					</FormGroup>
				</FormGroup>

				<Button bsStyle="default">Submit comment</Button>
			</form>
		)
	}

}


export default ProjectComment;