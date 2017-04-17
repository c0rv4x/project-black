import React from 'react'
import ScopeComment from '../../ips_list/presentational/scope/ScopeComment.jsx'

import PortsTabs from '../presentational/PortsTabs.jsx'
import TasksButtonsTracked from './TasksButtonsTracked.jsx'


class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div>
				<h2>{this.props.host.hostname} 
					<TasksButtonsTracked />
				</h2>
				<hr />
				<ScopeComment commentValue={this.props.host.comment} />

				<PortsTabs ports={this.props.ports} />
			</div>				  
		)
	}
}

export default MainAccumulator;
