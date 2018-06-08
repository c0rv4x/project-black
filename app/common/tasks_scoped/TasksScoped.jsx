import React from 'react'

import {
	Button,
	Card,
	Table,
	Header,
	Grid,
	Divider,
	Popup,
	Modal,
	Label,
	Image
} from 'semantic-ui-react'


class TasksScoped extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { target, tasks } = this.props;

		let table = [];

		for (var task of tasks.active) {
			table.push(
				<Table.Row key={task.task_id}>
					<Table.Cell>{task.task_type}</Table.Cell>
					<Table.Cell>{JSON.stringify(task.params.program)}</Table.Cell>
					<Table.Cell>{task.status}</Table.Cell>
				</Table.Row>
			);
		}

		for (var task of tasks.finished) {
			if (task.status == 'Finished') {
				table.push(
					<Table.Row key={task.task_id}>
						<Table.Cell>{task.task_type}</Table.Cell>
						<Table.Cell>{JSON.stringify(task.params.program)}</Table.Cell>
						<Table.Cell>{task.status}</Table.Cell>
					</Table.Row>
				);
			}
			else {
				table.push(
					<Table.Row key={task.task_id} negative>
						<Table.Cell>{task.task_type}</Table.Cell>
						<Table.Cell>{JSON.stringify(task.params.program)}</Table.Cell>
						<Table.Cell>{task.status}</Table.Cell>
					</Table.Row>
				);				
			}

		}
		return (
			<Modal trigger={<Button size='mini'>{tasks.active.length + tasks.finished.length} tasks</Button>}>
				<Modal.Header>{target}</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<Table basic='very'>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell width={3}>Type</Table.HeaderCell>
									<Table.HeaderCell width={10}>Options</Table.HeaderCell>
									<Table.HeaderCell width={3}>Status</Table.HeaderCell>
								</Table.Row>
							</Table.Header>

							<Table.Body>
								{table}
							</Table.Body>
						</Table>				
					</Modal.Description>
				</Modal.Content>				
			</Modal>
		)
	}
}

export default TasksScoped;