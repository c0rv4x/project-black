import React from 'react'

import ScopeCommentPresentational from './ScopeCommentPresentational.jsx'


class ScopeComment extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			scopeComment: this.props.comment
		};

		this.commentSubmitted = this.commentSubmitted.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}

	componentWillReceiveProps(nextProps) {
		if ((nextProps.comment !== this.props.comment) && (nextProps.comment !== this.state.beforeModification)) {
			if (!this.state.focused) {
				this.setState({
					scopeComment: nextProps.comment,
					commentShown: nextProps.comment !== "" && nextProps.comment !== null,
					beforeModification: nextProps.comment
				});
			}
			else {
				this.setState({
					receivedText: nextProps.comment
				})
			}
		}
	}

	commentSubmitted(e) {
		this.props.onCommentSubmit(e);
	}	

	render() {
		return (
			<ScopeCommentPresentational scopeComment={this.state.scopeComment}
										commentSubmitted={this.commentSubmitted} />
		)
	}
}

export default ScopeComment;
