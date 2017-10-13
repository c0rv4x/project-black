import React from 'react'
import { 
	Button, 
	FormControl,
	FormGroup,
	Label,
	Collapse,
	Input
} from 'reactstrap'


class ScopeCommentPresentational extends React.Component {

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
				<Button size="sm" onClick={this.toggle} style={{ marginBottom: '1rem' }}>Comment</Button>
				<Collapse isOpen={this.state.collapse}>
					<Input placeholder="Enter anything, that would help you in future. After moving focus out, the data will be saved."
				                 type="textarea" 
				                 value={this.props.scopeComment} 
				                 onChange={this.props.onChange}
				                 onBlur={this.props.onBlur}
				                 onFocus={this.props.onFocus}
				                 disabled={this.props.commentDisabled}/>	
				</Collapse>
			</div>
		)
	}
}

export default ScopeCommentPresentational;