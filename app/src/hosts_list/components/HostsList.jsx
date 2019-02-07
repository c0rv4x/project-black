import _ from 'lodash'
import React from 'react'

import Tasks from '../../common/tasks/Tasks.jsx'
import HostsTableTracked from './HostsTableTracked.jsx'
import TasksButtonsTracked from './TasksButtonsTracked.jsx'


class HostsList extends React.Component {
  	shouldComponentUpdate(nextProps) {
  		return (!_.isEqual(nextProps, this.props));
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
