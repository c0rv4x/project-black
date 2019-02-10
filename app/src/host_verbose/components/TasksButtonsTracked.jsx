import React from 'react'
import PropTypes from 'prop-types'

import ButtonTasks from '../../common/tasks_buttons/components/ButtonTasks.jsx'

import { requestCreateTask } from '../../redux/tasks/actions.js'


class TasksButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.dirbusterStart = this.dirbusterStart.bind(this);
	}

	dirbusterStart(options) {
		var target = this.props.host.hostname;

		this.context.store.dispatch(requestCreateTask('dirsearch', 
											{'host': [target],
											 'port:': [this.props.activePortNumber]}, 
											{'program': options,
											 'targets': 'hosts'}, 
											this.props.project_uuid));
	}

	render() {
		return (
			<ButtonTasks tasks={
				[
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

TasksButtonsTracked.contextTypes = {
    store: PropTypes.object
}

export default TasksButtonsTracked;