import React from 'react'

import TasksSocketioEventsEmitter from '../../redux/tasks/TasksSocketioEventsEmitter.js'
import ButtonTasks from '../../common/tasks_buttons/components/ButtonTasks.jsx'


class TitleButtonsWithHandlers extends React.Component {

	constructor(props) {
		super(props);

		this.tasksEmitter = new TasksSocketioEventsEmitter();

		this.runMasscan = this.runMasscan.bind(this);
		this.runNmap = this.runNmap.bind(this);
		this.runNmapOnlyOpen = this.runNmapOnlyOpen.bind(this);

		this.dirbusterStart = this.dirbusterStart.bind(this);
	}

	runMasscan(params) {
		this.tasksEmitter.requestCreateTask('masscan',
											this.props.filters,
											{'program': [params["argv"]]},
											this.props.project.project_uuid)
	}

	runNmap(params) {
		this.tasksEmitter.requestCreateTask('nmap', 
											this.props.filters, 
											{'program': [params["argv"]]},
											this.props.project.project_uuid)
	}	

	runNmapOnlyOpen(params) {
		var filters = this.props.filters;

		if (filters.hasOwnProperty('port')) {
			filters['port'].concat("%");
		}
		else {
			filters['port'] = ["%"];
		}
		this.tasksEmitter.requestCreateTask('nmap_open',
											filters,
											{'program': [params["argv"]]},
											this.props.project.project_uuid)
	}

	dirbusterStart(options) {
		this.tasksEmitter.requestCreateTask('dirsearch',
											this.props.filters,
											{'program': options,
											 'targets': 'ips'},
											this.props.project.project_uuid);
	}

	render() {
		return (
			<ButtonTasks project={this.props.project}
						 tasks={
						  	[
						  		{
						  			"name": "Masscan",
						  			"handler": this.runMasscan,
									"preformed_options": [
										{
											"name": "All Ports",
											"options": {
												"argv": "--rate 10000 -p1-65535"
											}
										},
										{
											"name": "First 10k Ports",
											"options": {
												"argv": "--rate 10000 -p1-10000"
											}
										},										
										{
											"name": "Top N ports",
											"options": {
												"argv": "--rate 10000 -p80,23,443,21,22,25,3389,110,445,139,143,53,135,3306,8080,1723,111,995,993,5900,1025,587,8888,199,1720,113,554,256"
											}
										}
									],
									"available_options": [
										{
											"name": "argv",
											"type": "text",
											"default_value": ""
										}
									]
						  		},
						  		{
						  			'name': 'Nmap',
						  			'handler': this.runNmap,
									"preformed_options": [
										{
											"name": "All Ports",
											"options": {
												"argv": "-p1-65535"
											}											
										},
										{
											"name": "Top ports",
											"options": {
												"argv": "--top-ports=2500"
											}
										}
									],
									"available_options": [
										{
											"name": "argv",
											"type": "text",
											"default_value": ""
										}
									]									
						  		},
						  		{
						  			"name": "Nmap Only Open Ports",
						  			"handler": this.runNmapOnlyOpen,
									"preformed_options": [
										{
											"name": "Banner",
											"options": {
												"argv": "-sV"
											}
										}
									],
									"available_options": [
										{
											"name": "argv",
											"type": "text",
											"default_value": ""
										}
									]
						  		},
								{
									"name": "Dirbuter",
									"handler": this.dirbusterStart,
									"preformed_options": [
										{
											"name": "PHP fanboy",
											"options": {
												"extensions": "php,php5,phps,php.bak",
												"path": "/"
											}
										},
										{
											"name": "ASP faggot",
											"options": {
												"extensions": "asp,aspx",
												"path": "/"
											}
										},
										{
											"name": "Personal favourites",
											"options": {
												"extensions": "php,asp,txt,conf,log,bak,sql",
												"path": "/"
											}
										}
									],
									"available_options": [
										{
											"name": "path",
											"type": "text",
											"default_value": "/"
										},						
										{
											"name": "extensions",
											"type": "text",
											"default_value": "txt,conf,log,bak"
										},
										{
											"name": "cookie",
											"type": "text",
											"default_value": ""
										},
										{
											"name": "recursive",
											"type": "checkbox",
											"default_value": false
										},
										{
											"name": "dirsearch_all_ips",
											"type": "checkbox",
											"text": "Add all current ips to dirsearch queue",
											"default_value": false
										},
										{
											"name": "dirsearch_single_ip",
											"type": "checkbox",
											"text": "Add one ip from each host to dirsearch queue",
											"default_value": false
										}					
									]
								}						  		
						  	]
						  } />
		)
	}

}


export default TitleButtonsWithHandlers;
