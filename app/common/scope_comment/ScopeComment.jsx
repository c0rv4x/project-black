import React from 'react'

import ScopeCommentPresentational from './ScopeCommentPresentational.jsx'


class ScopeComment extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			scopeComment: this.props.comment,
			beforeModification: this.props.comment,
			disabled: false,
			focused: false,
			receivedText: null
		};

		this.onFocus = this.onFocus.bind(this);
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

	onFocus() {
		this.setState({
			focused: true,
			beforeModification: this.state.scopeComment
		})
	}

	commentSubmitted(e) {
		this.props.onCommentSubmit(e);

		// var scopeComment = this.state.scopeComment;
		// if ((this.state.receivedText !== null) && (this.state.receivedText.length > 0)) {
		// 	scopeComment += "  ---------  " + this.state.receivedText
		// }
		// this.setState({
		// 	scopeComment: scopeComment,
		// 	focused: false,
		// 	receivedText: ''
		// })
	}

	render() {
		return (
			<ScopeCommentPresentational scopeComment={this.state.scopeComment}
										onFocus={this.onFocus}
										commentSubmitted={this.commentSubmitted}
										commentDisabled={this.props.disabled} 

										commentShown={this.state.commentShown} />
		)
	}
}

export default ScopeComment;
