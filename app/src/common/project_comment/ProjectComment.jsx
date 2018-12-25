import React from 'react'

import ProjectCommentPresentational from './ProjectCommentPresentational.jsx'
import ProjectsSocketioEventsEmitter from '../../redux/projects/ProjectsSocketioEventsEmitter.js'


class ProjectComment extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			projectComment: this.props.project.comment
		};

		this.commentSubmitted = this.commentSubmitted.bind(this);
	}

	componenDidMount() {
		this.projectsEmitter = new ProjectsSocketioEventsEmitter();
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
		this.projectsEmitter.requestUpdateProject(this.props.project.project_uuid,
												  this.props.project.project_name,
												  comment);
	}


	render() {
		return (
			<ProjectCommentPresentational projectComment={this.state.projectComment}
										  commentSubmitted={this.commentSubmitted} />
		)
	}
}

export default ProjectComment;
