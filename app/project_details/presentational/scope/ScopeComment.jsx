import React from 'react';
import { 
	Button, 
	FormControl,
	FormGroup,
	ControlLabel
} from 'react-bootstrap';


class ScopeComment extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<FormGroup controlId="formBasicText">
					<ControlLabel>Comment</ControlLabel>

					<FormControl placeholder="Enter anything, that would help you in future. After moving focus out, the data will be saved."
				                 type="text" 
				                 componentClass="textarea"
				                 value={this.props.commentValue} 
				                 onChange={this.props.onCommentChange}
				                 onBlur={this.props.onCommentSubmit}/>	
				</FormGroup>
			</div>
		)
	}
}

export default ScopeComment;
