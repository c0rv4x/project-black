import React from 'react'

import ProjectsSocketioEventsEmitter from '../../common/projects/ProjectsSocketioEventsEmitter.js';
import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';
import ProjectComment from '../presentational/ProjectComment.jsx';


class ProjectCommentTracked extends React.Component {

	constructor(props) {
		super(props);

		this.projectsEmitter = new ProjectsSocketioEventsEmitter();
		this.scopesEmitter = new ScopesSocketioEventsEmitter();

		this.onCommentInputChange = this.onCommentInputChange.bind(this);
		this.commentSubmitted = this.commentSubmitted.bind(this);		
	}

	onCommentInputChange(e) {
		this.props.onCommentChange(e.target.value, this.props.project.project_uuid);
	}

	commentSubmitted() {
		this.projectsEmitter.requestUpdateProject(
			this.props.project.project_uuid,
			null,
			this.props.project.comment);
	}

	render() {
		return (
			<ProjectComment commentInput={this.props.project.comment}
							onCommentInputChange={this.onCommentInputChange}
							commentSubmitted={this.commentSubmitted} 

							project={this.props.project}/>
		)
	}

}


export default ProjectCommentTracked;