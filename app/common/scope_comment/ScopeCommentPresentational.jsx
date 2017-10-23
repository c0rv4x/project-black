import React from 'react'

import { Transition, Button, TextArea, Form } from 'semantic-ui-react'


class ScopeCommentPresentational extends React.Component {

	constructor(props) {
		super(props);
	    this.toggle = this.toggle.bind(this);
	    this.state = { collapse: this.props.scopeComment ? true : false };		
	}

	toggle() {
		this.setState({ collapse: !this.state.collapse });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.scopeComment && !this.state.collapse) {
			this.toggle();
		}
	}

	render() {
		const { collapse } = this.state;
		var linesNumber = this.props.scopeComment.split('\n').length;

		if (linesNumber > 4) {
			linesNumber = 4;
		}

		return (
			<Form>
				<Button onClick={this.toggle}
				        style={{ marginBottom: '1rem' }}>
				        Toggle Comment
		        </Button>
		        <Transition.Group animation="fade down" duration={300}>
					{collapse && <TextArea placeholder="Enter some data to help yourself in further." 
									       value={this.props.scopeComment}
								           onChange={this.props.onChange}
								           rows={linesNumber}
								           onBlur={this.props.commentSubmitted} /> }
				</Transition.Group>
			</Form>
		)
	}

}


export default ScopeCommentPresentational;
