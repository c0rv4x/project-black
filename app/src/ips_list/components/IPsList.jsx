import _ from 'lodash'
import React from 'react'

import TitleButtonsWithHandlers from './TitleButtonsWithHandlers.jsx'
import IPTableTracked from './IPTableTracked.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'


class IPsList extends React.Component {
  	shouldComponentUpdate(nextProps) {
  		return !_.isEqual(nextProps, this.props);
  	}

	render() {
		let { ips, tasks, project_uuid, filters, applyFilters, renewIps } = this.props;

		return (
			<div>
				<TitleButtonsWithHandlers
					dicts={this.props.dicts}
					project_uuid={project_uuid} 
					filters={filters} />

				<Tasks tasks={tasks} />

				<IPTableTracked
					ips={ips}
					project_uuid={project_uuid}
					applyFilters={applyFilters}
					filters={filters}
					renewIps={renewIps}/>
			</div>
		)
	}
}

export default IPsList;
