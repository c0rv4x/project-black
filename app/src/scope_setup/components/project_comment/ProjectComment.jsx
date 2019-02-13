import React from 'react'
import PropTypes from 'prop-types'

import ProjectCommentPresentational from './ProjectCommentPresentational.jsx'

import { submitUpdateProject } from '../../../redux/projects/actions.js'


class ProjectComment extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			projectComment: this.props.project.comment
		};

		this.commentSubmitted = this.commentSubmitted.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return ((!_.isEqual(nextProps, this.props)) || (!_.isEqual(nextState, this.state)));
	}

	componentWillReceiveProps(nextProps) {
		let nextComment = nextProps.project.comment;

		if (nextComment !== this.props.project.comment) {
			this.setState({
				projectComment: nextComment
			});
		}
	}

	commentSubmitted(comment) {
		this.context.store.dispatch(submitUpdateProject(
			this.props.project.project_uuid,
			{ comment: comment }
		));
	}


	render() {
		return (
			<ProjectCommentPresentational projectComment={this.state.projectComment}
										  commentSubmitted={this.commentSubmitted} />
		)
	}
}


ProjectComment.contextTypes = {
    store: PropTypes.object
}

export default ProjectComment;
