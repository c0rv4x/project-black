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
			receivedText: null,
			commentShown: this.props.comment !== "" && this.props.comment !== null
		};

		this.commentChange = this.commentChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.triggerCommentShown = this.triggerCommentShown.bind(this);
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

	commentChange(e) {
		this.setState({
			scopeComment: e.target.value
		});
	}

	onFocus() {
		this.setState({
			focused: true,
			beforeModification: this.state.scopeComment
		})
	}

	onBlur(e) {
		this.props.onCommentSubmit(e);

		var scopeComment = this.state.scopeComment;
		if ((this.state.receivedText !== null) && (this.state.receivedText.length > 0)) {
			scopeComment += "  ---------  " + this.state.receivedText
		}
		this.setState({
			scopeComment: scopeComment,
			focused: false,
			receivedText: ''
		})
	}

	triggerCommentShown() {
		this.setState({
			commentShown: !this.state.commentShown
		});
	}

	render() {
		return (
			<ScopeCommentPresentational scopeComment={this.state.scopeComment}
										onChange={this.commentChange}
										onFocus={this.onFocus}
										onBlur={this.onBlur}
										commentDisabled={this.props.disabled} 

										triggerCommentShown={this.triggerCommentShown}
										commentShown={this.state.commentShown} />
		)
	}
}

export default ScopeComment;
