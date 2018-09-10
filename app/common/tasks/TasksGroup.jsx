import React from 'react'
import {
	Label,
	Progress,
	Table
} from 'semantic-ui-react'


class EachTask extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		let { tasks, type } = this.props;
		let progresses = [];

		for (let each_task of tasks) {
			if (each_task.status == 'Working') {
				progresses.push(
					<Progress
						id={"progress_task_" + each_task.task_id}
						key={"progress_task_" + each_task.task_id}
						percent={each_task.progress}
						size="medium"
						progress
					/>
				);
			}
		}


		return (
			<Table.Row>
				<Table.Cell>{type}</Table.Cell>
				<Table.Cell>{tasks.length}</Table.Cell>
				<Table.Cell>{progresses}</Table.Cell>
			</Table.Row>
		)
	}
}

export default EachTask;
