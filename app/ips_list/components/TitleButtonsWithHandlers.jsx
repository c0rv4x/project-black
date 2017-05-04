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
	}

	runMasscan(params) {
		console.log('starting masscan with',params);
		var targets = _.map(this.props.scopes.ips, (x) => {
			return x.ip_address || x.hostname
		});

		this.tasksEmitter.requestCreateTask('masscan', 
											targets, 
											{'program': params}, 
											this.props.project.project_uuid)
	}

	runNmap(params) {
		var targets = _.map(this.props.scopes.ips, (x) => {
			return x.ip_address;
		});

		this.tasksEmitter.requestCreateTask('nmap', 
											targets, 
											{'program': params}, 
											this.props.project.project_uuid)
	}	

	runNmapOnlyOpen(params) {
		var nonuniqueTargets = _.map(this.props.scans, (x) => {
			return x.target;
		});

		var targets = _.uniq(nonuniqueTargets);

		for (var target of targets) {
			let filtered_scans = _.filter(this.props.scans, (x) => {
				return x.target == target;
			});

			let ports = _.map(filtered_scans, (x) => {
				return x.port_number;
			});

			let flags = "-p" + ports.join();

			this.tasksEmitter.requestCreateTask('nmap', 
												[target], 
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
						  tasks={
						  	[
						  		{
						  			'name': 'Masscan',
						  			'handler': this.runMasscan,
									"preformed_options": [
										{
											"name": "All Ports",
											"options": {
												"-p": "1-65535"
											}
										},
										{
											"name": "Top 1000 ports",
											"options": {
												"-p": "80,443"
											}
										}
									],
									'available_options': [
										{
											"name": "-p",
											"display_name": "Ports",
											"type": "text",
											"default_value": "80,443"
										},
										{
											"name": "--kek",
											"display_name": "Kek",
											"type": "text",
											"default_value": "Yek"
										},										
									]
						  		},
						  		{
						  			'name': 'Nmap',
						  			'handler': this.runNmap,
									"preformed_options": [
										{
											"name": "All Ports",
											"options": {
												"-p": "1-65535"
											}
										},
										{
											"name": "Top 1000 ports",
											"options": {
												"-p": "80,443"
											}
										}
									],
									'available_options': [
										{
											"name": "-p",
											"display_name": "Ports",
											"type": "text",
											"default_value": "80,443"
										}
									]
						  		},
						  		{
						  			'name': 'Nmap Banner Edition',
						  			'handler': this.runNmapOnlyOpen,
									"preformed_options": [
										{
											"name": "All Ports",
											"options": {
												"-p": "1-65535"
											}
										},
										{
											"name": "Top 1000 ports",
											"options": {
												"-p": "80,443"
											}
										}
									],
									'available_options': [
										{
											"name": "-p",
											"display_name": "Ports",
											"type": "text",
											"default_value": "80,443"
										}
									]
						  		}
						  	]
						  } />
		)
	}

}


export default TitleButtonsWithHandlers;
