import _ from 'lodash'
import React from 'react'

import ReactTimeAgo from 'react-time-ago'

import {
	Box,
	Button,
	DataTable,
	Heading,
	Layer,
	Stack
} from 'grommet'
import { Tasks } from 'grommet-icons'


function renderParams(params) {
	if (params instanceof Array) {
		if (params.length <= 1) {
			return params;
		}
		else {
			return (
				<Box>
					{params.map((x) => {
						return <div key="x">{x}</div>
					})}
				</Box>
			)
		}
	}
	else if (params instanceof Object) {
		let dictionaryEntriesParsed = [];

		_.forOwn(params, (value, key) => {
			if (value) {
				dictionaryEntriesParsed.push(
					<div key={key}><b>{key}</b>: {value}</div>
				);
			}
		});

		return (
			<Box>
				{dictionaryEntriesParsed}
			</Box>
		)
	}
	else {
		alert("Scoped tasks params have incorrect types", params);
	}

	return JSON.stringify(params);
}

class TasksScoped extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			layerOpened: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
        return (!_.isEqual(nextProps, this.props) || (this.state.layerOpened !== nextState.layerOpened));
    }

	render() {
		const { target, tasks } = this.props;

		return (
			<div>
				<Stack
					anchor="top-right"
					onClick={() => this.setState({ layerOpened: true })}
				>
					<Button icon={<Tasks />} />
					<Box
						border={{ size: "xsmall", color: "brand" }}
						round="xlarge"
						background="brand"
						pad={{ left: "xxsmall", right: "xxsmall" }}
					>
						{tasks.active.length + tasks.finished.length}
					</Box>
				</Stack>
				{ this.state.layerOpened && (
					<Layer
						position="center"
						modal
						onClickOutside={() => this.setState({ layerOpened: false })}
						onEsc={() => this.setState({ layerOpened: false })}
					>
						<Box pad="medium" gap="small">
							<Heading margin="none" level="3">{target}</Heading>

							<DataTable
								columns={[
									{
										property: "task_type",
										header: "Type"
									},
									{
										property: "params",
										header: "Options",
										render: (task) => {
											return <Box width="medium" style={{
												"wordBreak": "break-word"
											}}>{renderParams(task.params.program)}</Box>
										}
									},
									{
										property: "status",
										header: "Status"
									},
									{
										property: "date_added",
										header: "Added",
										render: (task) => {
											return <Box width="xsmall"><ReactTimeAgo date={new Date(task.date_added)} /></Box>
										}
									}
								]}
								data={tasks.active.concat(tasks.finished)}
								primaryKey="task_id"
								sortable
								resizeable
							/>
						</Box>
					</Layer>
				)}
			</div>
		)
	}
}

export default TasksScoped;