import _ from 'lodash'
import React from 'react'

import TitleButtonsWithHandlers from './TitleButtonsWithHandlers.jsx'
import IPTableTracked from './IPTableTracked.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'
import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'


class IPsList extends React.Component {
	componentDidMount() {
		this.emitter = new IPsSocketioEventsEmitter();

  		if (this.props.ips)
  		{
  			this.emitter.requestTasksByIps(this.props.ips.data.map((ip) => {
  				return ip.ip_address;
  			}), this.props.project_uuid);
  		}
	}

  	shouldComponentUpdate(nextProps) {
  		return !_.isEqual(nextProps, this.props);
  	}

  	componentDidUpdate(prevProps) {
  		let prevIps = prevProps.ips;
  		let { ips, tasks, project_uuid } = this.props;

  		if (
  			(!prevIps) ||
  			(prevIps.page != ips.page) ||
  			(prevIps.page_size != ips.page_size) ||
  			(JSON.stringify(prevProps.tasks) != JSON.stringify(tasks))
		   )
  		{
  			this.emitter.requestTasksByIps(ips.data.map((ip) => {
  				return ip.ip_address;
  			}), project_uuid);
  		}
  	}

	render() {
		let { ips, tasks, project_uuid, filters, applyFilters, renewIps } = this.props;

		return (
			<div>
				<Tasks tasks={tasks} />
				<br/>

				<TitleButtonsWithHandlers
					dicts={this.props.dicts}
					project_uuid={project_uuid} 
					filters={filters} />

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
