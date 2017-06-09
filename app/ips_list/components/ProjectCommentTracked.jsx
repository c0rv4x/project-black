import React from 'react'

import ProjectsSocketioEventsEmitter from '../../redux/projects/ProjectsSocketioEventsEmitter.js'
import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import ProjectComment from '../presentational/ProjectComment.jsx'


class ProjectCommentTracked extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			projectComment: "",
			inputInited: false
		};

		this.projectsEmitter = new ProjectsSocketioEventsEmitter();
		this.scopesEmitter = new ScopesSocketioEventsEmitter();

		this.onCommentInputChange = this.onCommentInputChange.bind(this);
		this.commentSubmitted = this.commentSubmitted.bind(this);		
	}

	onCommentInputChange(e) {
		// this.props.onCommentChange(e.target.value, this.props.project.project_uuid);
		this.setState({
			projectComment: e.target.value
		});
	}

	componentWillReceiveProps(nextProps) {
		if ((!this.state.inputInited) && (this.props.project)) {
			const comment = this.props.project.comment;

			if (comment != this.state.projectComment) {
				this.setState({
					inputInited: true,
					projectComment: this.props.project.comment
				});				
			}
		}
	}

	commentSubmitted() {
		this.projectsEmitter.requestUpdateProject(
			this.props.project.project_uuid,
			null,
			this.props.project.comment);
	}

	render() {
		return (
			<ProjectComment commentInput={this.state.projectComment}
							onCommentInputChange={this.onCommentInputChange}
							commentSubmitted={this.commentSubmitted} 

							project={this.props.project}/>
		)
	}

}


export default ProjectCommentTracked;
