import React from 'react'

import HostsListHead from '../presentational/HostsListHead.jsx'
import Tasks from '../../project_details/presentational/tasks/Tasks.jsx'


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

				
			</div>
		)
	}
}

export default HostsList;