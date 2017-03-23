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

					<FormControl placeholder="Test"
				                 type="text" 
				                 componentClass="textarea"
				                 value={this.props.commentValue} 
				                 onChange={this.props.onCommentChange}/>	
				</FormGroup>
			    <Button bsSize="small" onClick={this.props.onCommentSubmit}>Save comment</Button>			
			</div>
		)
	}
}

export default ScopeComment;
