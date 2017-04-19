import React from 'react'
import ScopeComment from '../../ips_list/presentational/scope/ScopeComment.jsx'

import PortsTabs from '../presentational/PortsTabs.jsx'
import TasksButtonsTracked from './TasksButtonsTracked.jsx'
import Tasks from '../../ips_list/presentational/tasks/Tasks.jsx'


class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'activeTabNumber': null
		}				


		this.tabChange = this.tabChange.bind(this);
	}

	tabChange(newNumber) {
		this.setState({
			activeTabNumber: newNumber
		});
	}

	render() {
		return (
			<div>
				<h2>{this.props.host.hostname} 
					<TasksButtonsTracked project={this.props.project}
										 host={this.props.host}
										 ports={this.props.ports}
										 activeTabNumber={this.state.activeTabNumber} />
				</h2>
				<Tasks tasks={this.props.tasks} />
				<hr />
				<ScopeComment commentValue={this.props.host.comment} />

				<PortsTabs ports={this.props.ports}
					   	   activeTabNumber={this.state.activeTabNumber}
					   	   tabChange={this.tabChange} />
			</div>				  
		)
	}
}

export default MainAccumulator;
