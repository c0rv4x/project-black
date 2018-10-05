import _ from 'lodash'
import React from 'react'

import TitleButtonsWithHandlers from './TitleButtonsWithHandlers.jsx'
import IPTableTracked from './IPTableTracked.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'


class ProjectDetails extends React.Component {
	constructor(props) {
		super(props);

		this.emitter = new IPsSocketioEventsEmitter();

  		if (this.props.ips)
  		{
  			this.emitter.requestTasksByIps(this.props.ips.data.map((ip) => {
  				return ip.ip_address;
  			}), this.props.project.project_uuid);
  		}		
	}

  	shouldComponentUpdate(nextProps) {
  		return !_.isEqual(nextProps, this.props);
  	}

  	componentDidUpdate(prevProps) {
  		let prevIps = prevProps.ips;
  		let { ips, project, tasks } = this.props;

  		if (
  			(!prevIps) ||
  			(prevIps.page != ips.page) ||
  			(prevIps.page_size != ips.page_size) ||
  			(JSON.stringify(prevProps.tasks) != JSON.stringify(tasks))
		   )
  		{
  			this.emitter.requestTasksByIps(ips.data.map((ip) => {
  				return ip.ip_address;
  			}), project.project_uuid);
  		}
  	}

	render() {
		let { ips, hosts, project, filters, applyFilters, setLoaded, renewIps } = this.props;

		return (
			<div>
				<Tasks tasks={this.props.tasks} />
				<br/>

				<TitleButtonsWithHandlers
					project={project} 
					filters={this.props.filters} />

				<IPTableTracked ips={ips}
								project_uuid={project.project_uuid}
								applyFilters={applyFilters}
								filters={filters}
								setLoaded={setLoaded}
								renewIps={renewIps}/>
			</div>
		)
	}
}

export default ProjectDetails;
