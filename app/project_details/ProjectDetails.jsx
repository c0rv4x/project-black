import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';

import ScopeStore from './ScopeStore.js';


class ProjectDetails extends Reflux.Component
{

	constructor(props) {
		super(props);
        this.store = ScopeStore;

		this.projectName = props['match']['params']['projectName'];
	}

	render() {
		return (
			<div>
				<h2>Project Details {this.projectName}</h2>
			</div>
		)
	}

}

export default ProjectDetails;