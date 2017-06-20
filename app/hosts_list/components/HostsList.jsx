import _ from 'lodash'
import React from 'react'

import HostsListHead from '../presentational/HostsListHead.jsx'
import Tasks from '../../ips_list/presentational/tasks/Tasks.jsx'
import HostsTableTracked from './HostsTableTracked.jsx'


class HostsList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<HostsListHead />
				<Tasks tasks={this.props.tasks} />

				<hr />

				<HostsTableTracked project={this.props.project}
								   scopes={this.props.scopes}
								   onCommentChange={this.props.onScopeCommentChange}

								   scans={this.props.scans} />
			</div>
		)
	}
}

export default HostsList;
