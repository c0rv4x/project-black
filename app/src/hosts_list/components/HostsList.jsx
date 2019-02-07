import _ from 'lodash'
import React from 'react'

import Tasks from '../../common/tasks/Tasks.jsx'
import HostsTableTracked from './HostsTableTracked.jsx'
import TasksButtonsTracked from './TasksButtonsTracked.jsx'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'


class HostsList extends React.Component {
	componentDidMount() {
		this.emitter = new HostsSocketioEventsEmitter();

  		if (this.props.hosts)
  		{
  			this.emitter.requestTasksByHosts(this.props.hosts.data.map((host) => {
  				return host.hostname;
  			}), this.props.project_uuid);
  		}	
	}

  	shouldComponentUpdate(nextProps) {
  		return (!_.isEqual(nextProps, this.props));
  	}

  	componentDidUpdate(prevProps) {
  		let prevHosts = prevProps.hosts;
  		let { hosts, project_uuid, tasks } = this.props;

  		if (
  			(!prevHosts) ||
  			(prevHosts.page != hosts.page) ||
  			(prevHosts.page_size != hosts.page_size) ||
  			(JSON.stringify(prevProps.tasks) != JSON.stringify(tasks))
		   )
  		{
  			this.emitter.requestTasksByHosts(hosts.data.map((host) => {
  				return host.hostname;
  			}), project_uuid);
  		}
  	}

	render() {
		const { hosts, dicts, project_uuid, filters } = this.props;

		return (
			<div>
				<Tasks tasks={this.props.tasks} />
				<br/>
				<TasksButtonsTracked
					hosts={hosts}
					dicts={dicts}
					project_uuid={project_uuid}
					filters={filters} />

				<HostsTableTracked
					project_uuid={project_uuid}
					hosts={hosts}
					renewHosts={this.props.renewHosts}
					applyFilters={this.props.applyFilters} />
			</div>
		)
	}
}

export default HostsList;
