import React from 'react'
import { Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap'

import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ButtonsTasks from './ButtonsTasks.jsx'


class TitleButtonsWithHandlers extends React.Component {

	constructor(props) {
		super(props);

		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.runMasscan = this.runMasscan.bind(this);
		this.runNmap = this.runNmap.bind(this);
		this.runNmapOnlyOpen = this.runNmapOnlyOpen.bind(this);
		this.doSetTimeout = this.doSetTimeout.bind(this);
	}

	runMasscan(params) {
		var targets = _.map(this.props.scopes, (x) => {
			return x.ip_address || x.hostname
		});

		this.tasksEmitter.requestCreateTask('masscan', 
											targets, 
											{'program': params}, 
											this.props.project.project_uuid)
	}

	runNmap(params) {
		var targets = _.map(this.props.scopes, (x) => {
			return x.ip_address;
		});

		var startTime = 0;

		for (var target of targets) {
			setTimeout(() => {
				this.tasksEmitter.requestCreateTask('nmap', 
													[target], 
													{'program': params}, 
													this.props.project.project_uuid)
			}, startTime);

			startTime += 70;
		}
	}	

	doSetTimeout(each_task, startTime) {
		// setTimeout(() => {
			this.tasksEmitter.requestCreateTask('nmap', 
												[each_task.ip_address], 
												{
													'program': [each_task.flags, '-sV'],
													'saver': {
														'scans_ids': each_task.scans.map((x) => {
															console.log(x.scan_id, x.port_number, x);
															return {
																'scan_id': x.scan_id,
																'port_number': x.port_number
															}
														})
													}
												}, 
												this.props.project.project_uuid);
		// }, startTime);
	}

	runNmapOnlyOpen(params) {
		var targets = this.props.scopes.filter((x) => {
			return x.scans.length > 0;
		});
		var startTime = 0;

		var task_queue = [];

		for (var target of targets) {
			let ip_address = target.ip_address;
			let ports = target.scans.map((x) => {
				return x.port_number;
			});

			let flags = "-p" + ports.join();

			task_queue.push({
				ip_address: ip_address,
				flags: flags,
				scans: target.scans
			});
		}

		for (var each_task of task_queue) {
			this.doSetTimeout(each_task, startTime);

			startTime += 70;
		}

	}	

	render() {
		return (
			<ButtonsTasks project={this.props.project}
						  tasks={
						  	[
						  		{
						  			'name': 'Masscan',
						  			'handler': this.runMasscan,
									"preformed_options": [
										{
											"name": "All Ports",
											"options": "--rate 10000 -p1-65535"
										},
										{
											"name": "10k Ports",
											"options": "--rate 10000 -p1-10000"
										},										
										{
											"name": "Top N ports",
											"options": "--rate 10000 -p80,23,443,21,22,25,3389,110,445,139,143,53,135,3306,8080,1723,111,995,993,5900,1025,587,8888,199,1720,113,554,256"
										}
									]
						  		},
						  		{
						  			'name': 'Nmap',
						  			'handler': this.runNmap,
									"preformed_options": [
										{
											"name": "All Ports",
											"options": "-p1-65535"
										},
										{
											"name": "Top ports",
											"options": "-p80,23,443,21,22,25,3389,110,445,139,143,53,135,3306,8080,1723,111,995,993,5900,1025,587,8888,199,1720,113,554,256"
										}
									]
						  		},
						  		{
						  			'name': 'Nmap Only Open Ports',
						  			'handler': this.runNmapOnlyOpen,
									"preformed_options": [
										{
											"name": "Banner",
											"options": "-sV"
										}
									]
						  		}
						  	]
						  } />
		)
	}

}


export default TitleButtonsWithHandlers;
