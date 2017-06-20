import _ from 'lodash'
import React from 'react'
import { 
	Button, 
	FormControl,
	FormGroup,
	ControlLabel
} from 'react-bootstrap'


class ScopeComment extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			scopeComment: this.props.commentValue
		};

		this.commentChange = this.commentChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.commentValue) {
			const comment = nextProps.commentValue;

			if (comment != this.state.scopeComment) {
				this.setState({
					scopeComment: comment
				});				
			}
		}
	}

	commentChange(e) {
		this.setState({
			scopeComment: e.target.value
		});
	}

	render() {
		return (
			<div>
				<FormGroup controlId="formBasicText">
					<ControlLabel>Comment</ControlLabel>

					<FormControl placeholder="Enter anything, that would help you in future. After moving focus out, the data will be saved."
				                 type="text" 
				                 componentClass="textarea"
				                 value={this.state.scopeComment} 
				                 onChange={this.commentChange}
				                 onBlur={this.props.onCommentSubmit}/>	
				</FormGroup>
			</div>
		)
	}
}

export default ScopeComment;
