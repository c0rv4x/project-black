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
								   project={this.props.project} 
								   scans={this.props.scans} />

				<hr/>
				<Tasks tasks={this.props.tasks} />
				<ProjectCommentTracked project={this.props.project}
									   onCommentChange={this.props.onCommentChange} />
				<ScopeTracked project={this.props.project}
							  scopes={this.props.scopes}
							  scans={this.props.scans} />
			</div>
		)
	}
}

export default ProjectDetails;