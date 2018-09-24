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

	componentDidUpdate(prevProps, prevState) {
		if (this.props.comment !== prevProps.comment) {
			this.setState({
				scopeComment: this.props.comment
			});
		}
	}

	commentSubmitted(e) {
		this.props.onCommentSubmit(e);
	}	

	render() {
		return (
			<ScopeCommentPresentational
				scopeComment={this.state.scopeComment}
				commentSubmitted={this.commentSubmitted}
			/>
		)
	}
}

export default ScopeComment;
