import React from 'react'

import {
	Box,
	Button,
	DataTable,
	Heading,
	Layer,
	Stack,
	Text
} from 'grommet'
import { Tasks } from 'grommet-icons'


class TasksScoped extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			layerOpened: true
		}
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
											}}>{task.params.program}</Box>
										}
									},
									{
										property: "status",
										header: "Status"
									},
									{
										property: "date_added",
										header: "Added",
									}
								]}
								data={tasks.active.concat(tasks.finished)}
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