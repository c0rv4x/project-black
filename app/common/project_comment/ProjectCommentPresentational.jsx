import React from 'react'
import { 
	Form,
	FormGroup,
	Label,
	Input,
	Button,
	Collapse
} from 'reactstrap'


class ProjectComment extends React.Component {

	constructor(props) {
		super(props);
	    this.toggle = this.toggle.bind(this);
	    this.state = { collapse: false };		
	}

	toggle() {
		this.setState({ collapse: !this.state.collapse });
	}	

	render() {
		return (
			<div>
				<Button outline
				        onClick={this.toggle}
				        style={{ marginBottom: '1rem' }}>
				        Toggle Comment
		        </Button>
		        <Collapse isOpen={this.state.collapse}>
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
				</Collapse>
			</div>
		)
	}

}


export default ProjectComment;
