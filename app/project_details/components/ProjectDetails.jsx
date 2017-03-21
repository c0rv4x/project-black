import _ from 'lodash';
import React from 'react';

import TitleWithHandlers from './TitleWithHandlers.jsx'
import ProjectCommentTracked from './ProjectCommentTracked.jsx'
import ScopeTracked from './ScopeTracked.jsx'
import Tasks from '../presentational/tasks/Tasks.jsx';


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<TitleWithHandlers scopes={this.props.scopes}
								   project={this.props.project} />

				<hr/>
				<Tasks tasks={this.props.tasks} />
				<ProjectCommentTracked project={this.props.project}
									   onCommentChange={this.props.onCommentChange} />
			</div>
		)
	}
}

export default ProjectDetails;