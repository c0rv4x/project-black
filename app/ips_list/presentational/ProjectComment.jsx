import React from 'react'
import { 
	Button,
	FormGroup,
	ControlLabel,
	FormControl,
	HelpBlock 
} from 'reactstrap'


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

						<FormControl componentClass="textarea" 
									 placeholder="
						Enter some data to help yourself in further." 
									 value={this.props.commentInput}
								     onChange={this.props.onCommentInputChange}
								     onBlur={this.props.commentSubmitted} />
					</FormGroup>
				</FormGroup>
			</form>
		)
	}

}


export default ProjectComment;
