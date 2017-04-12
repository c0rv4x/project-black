import React from 'react'
import ScopeComment from '../../ips_list/presentational/scope/ScopeComment.jsx'

import PortsTabs from '../presentational/PortsTabs.jsx'
import TasksButtons from '../presentational/TasksButtons.jsx'


class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div>
				<h2>{this.props.host.hostname} <TasksButtons /></h2>
				<hr />
				<ScopeComment commentValue={this.props.host.comment} />

				<PortsTabs ports={this.props.ports} />
			</div>				  
		)
	}
}

export default MainAccumulator;
