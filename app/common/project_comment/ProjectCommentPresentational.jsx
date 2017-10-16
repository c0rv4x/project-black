import React from 'react'

import { Transition, Button, TextArea, Form } from 'semantic-ui-react'


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
		const { collapse } = this.state;

		return (
			<Form>
				<Button onClick={this.toggle}
				        style={{ marginBottom: '1rem' }}>
				        Toggle Comment
		        </Button>
		        <Transition.Group animation="fade down" duration={500}>
					{collapse && <TextArea id="projectComment"
									       placeholder="Enter some data to help yourself in further." 
									       value={this.props.commentInput}
								           onChange={this.props.onCommentInputChange}
								           onBlur={this.props.commentSubmitted} /> }
				</Transition.Group>
			</Form>
		)
	}

}


export default ProjectComment;
