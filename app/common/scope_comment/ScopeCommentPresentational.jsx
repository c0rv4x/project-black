import React from 'react'
import { 
	Button, 
	FormControl,
	FormGroup,
	ControlLabel,
	Glyphicon
} from 'react-bootstrap'


class ScopeCommentPresentational extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var triggerGlyph = <Glyphicon glyph={this.props.commentShown ? "chevron-up" : "chevron-down"}/>;

		return (
			<div>
				<FormGroup controlId="formBasicText" style={{'marginBottom': '-10px'}}>
					<ControlLabel><div><Button bsSize="small" onClick={this.props.triggerCommentShown}>{triggerGlyph} Comment</Button></div></ControlLabel>

					{this.props.commentShown && 
						<FormControl placeholder="Enter anything, that would help you in future. After moving focus out, the data will be saved."
					                 type="text" 
					                 componentClass="textarea"
					                 value={this.props.scopeComment} 
					                 onChange={this.props.onChange}
					                 onBlur={this.props.onBlur}
					                 onFocus={this.props.onFocus}
					                 disabled={this.props.commentDisabled}/>	
					}
				</FormGroup>
			</div>
		)
	}
}

export default ScopeCommentPresentational;