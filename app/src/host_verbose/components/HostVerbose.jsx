import React from 'react'

import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import PortsTabs from '../presentational/PortsTabs.jsx'
import TasksButtonsTracked from './TasksButtonsTracked.jsx'
import Tasks from '../../common/tasks/Tasks.jsx'

import { Header, Divider } from 'semantic-ui-react'

import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter'


class HostVerbose extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'activeTabNumber': null,
			'activePortNumber': null
		}

		this.emitter = new HostsSocketioEventsEmitter();

		if (this.props.update_needed) {
			this.emitter.requestRenewHosts({'host': [this.props.host.hostname]});
		}

		this.tabChange = this.tabChange.bind(this);
		this.commentSubmitted = this.commentSubmitted.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if (JSON.stringify(this.props.ports) !== JSON.stringify(newProps.ports)) {
			if (typeof this.state.activePortNumber === 'undefined') {
				this.setState({
					activePortNumber: newProps.ports[0].port_number,
					activeTabNumber: 0
				});
			}		
		}

		if (newProps.update_needed) {
			this.emitter.requestRenewHosts(this.props.project_uuid, {'host': [this.props.host.hostname]});
		}
	}

	tabChange(newNumber) {
		this.setState({
			activeTabNumber: newNumber,
			activePortNumber: this.props.ports[newNumber].port_number
		});
	}

	commentSubmitted(comment, _id) {
		this.emitter.requestUpdateHost(comment, _id, this.props.project_uuid, "host");
	}

	render() {
		const { host, tasks, ports, project_uuid } = this.props;

		return (
			<div>
				<br/>
				<Header as="h2">{host.hostname}</Header>
			
				<Tasks tasks={tasks} />
				<Divider />
				<TasksButtonsTracked project_uuid={project_uuid}
									 host={host}
									 activePortNumber={this.state.activePortNumber} />					
				<ScopeComment comment={host.comment}
							  onCommentSubmit={(value) => this.commentSubmitted(value, host.host_id)} />

				<PortsTabs ports={ports}
					   	   activeTabNumber={this.state.activeTabNumber}
					   	   tabChange={this.tabChange}
					   	   files={host.files} />
			</div>				  
		)
	}
}

export default HostVerbose;
