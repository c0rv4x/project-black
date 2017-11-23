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
		return (
			<div>
				<br/>

				<TitleButtonsWithHandlers scopes={this.props.scopes.ips.data}
									      project={this.props.project} 
									      scans={this.props.scans} />			
				<IPTableTracked ips={this.props.scopes.ips}
								project_uuid={this.props.project.project_uuid}
								onFilterChange={this.props.onFilterChangeIPs}
								setLoading={this.props.setLoading} />
			</div>
		)
	}
}

export default ProjectDetails;
