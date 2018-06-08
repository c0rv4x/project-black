import _ from 'lodash'
import React from 'react'
import Notifications from 'react-notification-system-redux'
import { Dimmer, Loader } from 'semantic-ui-react'

import HostsListHead from '../presentational/HostsListHead.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'
import HostsTableTracked from './HostsTableTracked.jsx'
import TasksButtonsTracked from './TasksButtonsTracked.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'

import { Button } from 'semantic-ui-react'


class HostsList extends React.Component {
	constructor(props) {
		super(props);

		this.emitter = new HostsSocketioEventsEmitter();

  		if (this.props.hosts)
  		{
  			this.emitter.requestTasksByHosts(this.props.hosts.data.map((host) => {
  				return host.hostname;
  			}), this.props.project_uuid);
  		}		
	}

	render() {
		const { hosts, project_uuid, filters } = this.props;

		return (
			<div>
				<Tasks tasks={this.props.tasks} />
				<br/>
				<TasksButtonsTracked hosts={hosts}
									 project_uuid={project_uuid}
									 filters={filters} />

				<HostsTableTracked project_uuid={project_uuid}
								   hosts={hosts}
								   setLoading={this.props.setLoading}
								   renewHosts={this.props.renewHosts}
								   requestUpdateHost={this.props.requestUpdateHost}
								   applyFilters={this.props.applyFilters} />
			</div>
		)
	}
}

export default HostsList;
