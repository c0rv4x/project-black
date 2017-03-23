import _ from 'lodash';
import React from 'react';

import TitleButtonsWithHandlers from './TitleButtonsWithHandlers.jsx'
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
				<TitleButtonsWithHandlers scopes={this.props.scopes}
								   project={this.props.project} 
								   scans={this.props.scans} />

				<hr/>
				<Tasks tasks={this.props.tasks} />
				<ProjectCommentTracked project={this.props.project}
									   onCommentChange={this.props.onProjectCommentChange} />
				<ScopeTracked project={this.props.project}
							  scopes={this.props.scopes}
							  onCommentChange={this.props.onScopeCommentChange}

							  scans={this.props.scans} />
			</div>
		)
	}
}

export default ProjectDetails;