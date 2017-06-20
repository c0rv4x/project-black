import React from 'react'

import ScopeCommentPresentational from './ScopeCommentPresentational.jsx'


class ScopeComment extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			scopeComment: "",
			scopeCommentInited: false
		};

		this.commentChange = this.commentChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if ((!this.state.scopeCommentInited) && (this.props.scope) || this.props.forceRenew) {
			const comment = this.props.scope.comment;

			if (comment != this.state.scopeComment) {
				this.setState({
					scopeCommentInited: true,
					scopeComment: this.props.scope.comment
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
			<ScopeCommentPresentational scopeComment={this.state.scopeComment}
										onChange={this.commentChange}
										onCommentSubmit={this.props.onCommentSubmit} />
		)
	}
}

export default ScopeComment;
