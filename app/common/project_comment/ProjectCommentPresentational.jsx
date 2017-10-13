import React from 'react'
import { 
	Form,
	FormGroup,
	Label,
	Input
} from 'reactstrap'


class ProjectComment extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Form>
				<FormGroup>
					<Label for="projectComment">Comment</Label>

					<Input type="textarea"
						   id="projectComment"
						   placeholder="Enter some data to help yourself in further." 
						   value={this.props.commentInput}
					       onChange={this.props.onCommentInputChange}
					       onBlur={this.props.commentSubmitted} />
				</FormGroup>
			</Form>
		)
	}

}


export default ProjectComment;
