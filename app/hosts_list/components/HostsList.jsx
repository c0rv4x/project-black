import _ from 'lodash'
import React from 'react'
import Notifications from 'react-notification-system-redux'
import { Dimmer, Loader } from 'semantic-ui-react'

import HostsListHead from '../presentational/HostsListHead.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'
import HostsTableTracked from './HostsTableTracked.jsx'
import TasksButtonsTracked from './TasksButtonsTracked.jsx'

import { Button } from 'semantic-ui-react'


class HostsList extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { hosts, project_uuid } = this.props;

		return (
			<div>
				<Tasks tasks={this.props.tasks} />
				<br/>
				<TasksButtonsTracked hosts={hosts}
									 project_uuid={project_uuid} />

				<HostsTableTracked project_uuid={project_uuid}
								   hosts={hosts}
								   setLoading={this.props.setLoading}
								   renewHosts={this.props.renewHosts} />
			</div>
		)
	}
}

export default HostsList;
