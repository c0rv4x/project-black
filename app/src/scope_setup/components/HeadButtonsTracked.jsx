import React from 'react'

import { Box } from 'grommet'

import ProjectsSocketioEventsEmitter from '../../redux/projects/ProjectsSocketioEventsEmitter.js'
import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ResolveButton from '../presentational/ResolveButton.jsx'
import ScopesLock from '../presentational/ScopesLock.jsx'
import TaskButton from './TaskButton.jsx'


class HeadButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.resolveScopes = this.resolveScopes.bind(this);
		this.setLockIps = this.setLockIps.bind(this);
		this.setLockHosts = this.setLockHosts.bind(this);
	}

	componentDidMount() {
		this.projectsEmitter = new ProjectsSocketioEventsEmitter();
		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.tasksEmitter = new TasksSocketioEventsEmitter();
	}

	resolveScopes(scopes_ids, project_uuid) {
		this.hostsEmitter.requestResolveHosts(scopes_ids, project_uuid);
	}

	setLockIps(value) {
		this.projectsEmitter.requestUpdateIpsLock(this.props.project.project_uuid, value);
	}

	setLockHosts(value) {
		this.projectsEmitter.requestUpdateHostsLock(this.props.project.project_uuid, value);
	}

	render() {
		return (
			<Box direction="row" align="center" gap="xsmall" pad="xsmall">
				<ScopesLock 
					status={this.props.project.ips_locked}
					name="ips"
					setLock={this.setLockIps}
				/>

				<ScopesLock 
					status={this.props.project.hosts_locked}
					name="hosts"
					setLock={this.setLockHosts}
				/>
				
				<ResolveButton
					project={this.props.project}
					hostsResolved={this.props.hosts.resolve_finished}
					resolveScopes={() => this.resolveScopes(null, this.props.project.project_uuid)}
				/>

				<TaskButton
					project_uuid={this.props.project.project_uuid}
					hosts={this.props.hosts}
				/>
			</Box>
		)
	}
}

export default HeadButtonsTracked;
