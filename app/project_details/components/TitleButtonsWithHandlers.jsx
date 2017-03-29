import React from 'react'
import { Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

import TasksSocketioEventsEmitter from '../../common/tasks/TasksSocketioEventsEmitter.js';
import ButtonsTasks from '../presentational/ButtonsTasks.jsx';


class TitleButtonsWithHandlers extends React.Component {

	constructor(props) {
		super(props);

		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.runMasscan = this.runMasscan.bind(this);
		this.runNmap = this.runNmap.bind(this);
		this.runNmapOnlyOpen = this.runNmapOnlyOpen.bind(this);
	}

	runMasscan() {
		var targets = _.map(this.props.scopes.ips, (x) => {
			return x.ip_address || x.hostname
		});

		this.tasksEmitter.requestCreateTask('masscan', 
											targets, 
											{'program': ['-p80,443']}, 
											this.props.project.project_uuid)
	}

	runNmap() {
		var targets = _.map(this.props.scopes.ips, (x) => {
			return x.ip_address;
		});

		this.tasksEmitter.requestCreateTask('nmap', 
											targets, 
											{'program': []}, 
											this.props.project.project_uuid)
	}	

	runNmapOnlyOpen() {
		var targets = _.map(this.props.scans, (x) => {
			return x.target;
		});

		for (var target of targets) {
			let filtered_scans = _.filter(this.props.scans, (x) => {
				return x.target == target;
			});

			let ports = _.map(filtered_scans, (x) => {
				return x.port_number;
			});

			let flags = "-p" + ports.join();

			this.tasksEmitter.requestCreateTask('nmap', 
												target, 
												{
													'program': [flags, '-sV'],
													'saver': {
														'scans_ids': _.map(filtered_scans, (x) => {
															return {
																'scan_id': x.scan_id,
																'port_number': x.port_number
															}
														})
													}
												}, 
												this.props.project.project_uuid)
		}

	}	

	render() {
		return (
			<ButtonsTasks project={this.props.project}
						  runMasscan={this.runMasscan}
						  runNmap={this.runNmap}
						  runNmapOnlyOpen={this.runNmapOnlyOpen} />
		)
	}

}


export default TitleButtonsWithHandlers;