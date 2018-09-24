import React from 'react'

import ScopeCommentPresentational from './ScopeCommentPresentational.jsx'


class ScopeComment extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			scopeComment: this.props.comment,
			valueBeforeEdited: this.props.comment
		};

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}

	componentDidUpdate(prevProps) {
		if ((this.props.comment !== prevProps.comment) && (this.props.comment != this.state.valueBeforeEdited)) {
			this.setState({
				scopeComment: this.props.comment,
				valueBeforeEdited : this.props.comment
			});
		}
	}

	commentSubmitted(e) {
		this.props.onCommentSubmit(e);
	}

	onChange(value) {
		this.setState({
			scopeComment: value
		});
	}

	render() {
		return (
			<ScopeCommentPresentational
				onChange={this.onChange}
				scopeComment={this.state.scopeComment}
				commentSubmitted={this.commentSubmitted}
			/>
		)
	}
}

export default ScopeComment;
