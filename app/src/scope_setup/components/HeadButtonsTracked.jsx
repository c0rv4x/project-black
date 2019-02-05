import React from 'react'
import PropTypes from 'prop-types'

import { Box } from 'grommet'

import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter.js'
import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ResolveButton from '../presentational/ResolveButton.jsx'
import ScopesLock from '../presentational/ScopesLock.jsx'
import TaskButton from './TaskButton.jsx'

import { submitUpdateProject } from '../../redux/projects/actions.js'


class HeadButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.resolveScopes = this.resolveScopes.bind(this);
		this.setLockIps = this.setLockIps.bind(this);
		this.setLockHosts = this.setLockHosts.bind(this);
	}

	componentDidMount() {
		this.hostsEmitter = new HostsSocketioEventsEmitter();
		this.tasksEmitter = new TasksSocketioEventsEmitter();
	}

	resolveScopes(scopes_ids, project_uuid) {
		this.hostsEmitter.requestResolveHosts(scopes_ids, project_uuid);
	}

	setLockIps(value) {
		this.context.store.dispatch(submitUpdateProject(
			this.props.project.project_uuid,
			{ ips_locked: value }
		));
	}

	setLockHosts(value) {
		this.context.store.dispatch(submitUpdateProject(
			this.props.project.project_uuid,
			{ hosts_locked: value }
		));
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

HeadButtonsTracked.contextTypes = {
    store: PropTypes.object
}


export default HeadButtonsTracked;
