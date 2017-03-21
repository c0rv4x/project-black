import _ from 'lodash';
import React from 'react';

import TitleWithHandlers from './TitleWithHandlers.jsx'
import ProjectCommentTracked from './ProjectCommentTracked.jsx'
import ScopeTracked from './ScopeTracked.jsx'


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TitleWithHandlers scopes={this.props.scopes}
							   project={this.props.project} />
		)
	}
}

export default ProjectDetails;