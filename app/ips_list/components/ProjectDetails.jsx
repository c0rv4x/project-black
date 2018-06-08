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

  	componentDidUpdate(prevProps) {
  		let prevIps = prevProps.ips;
  		let { ips, project } = this.props;

  		if (
  			(!prevIps) ||
  			(prevIps.page != ips.page) ||
  			(prevIps.page_size != ips.page_size)
		   )
  		{
  			this.emitter.requestTasksByIps(ips.data.map((ip) => {
  				return ip.ip_address;
  			}), project.project_uuid);
  		}
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
