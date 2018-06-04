import _ from 'lodash'
import React from 'react'

import TitleButtonsWithHandlers from './TitleButtonsWithHandlers.jsx'
import IPTableTracked from './IPTableTracked.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);
	}

  	shouldComponentUpdate(nextProps) {
  		return (!_.isEqual(nextProps, this.props));
  	}

	render() {
		let { ips, hosts, project, filters, applyFilters, setLoading, renewIps } = this.props;

		return (
			<div>
				<Tasks tasks={this.props.tasks} />
				<br/>

				<TitleButtonsWithHandlers scopes={ips.data}
									      project={project} 
									      filters={this.props.filters} />

				<IPTableTracked ips={ips}
								project_uuid={project.project_uuid}
								applyFilters={applyFilters}
								filters={filters}
								setLoading={setLoading}
								renewIps={renewIps}/>
			</div>
		)
	}
}

export default ProjectDetails;
