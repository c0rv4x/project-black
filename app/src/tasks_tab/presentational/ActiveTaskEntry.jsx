import React from 'react'

import { renderParams } from '../../common/tasks_scoped/TasksScoped.jsx'

import { Button, TableCell, TableRow, Text } from 'grommet'
import { Clear } from 'grommet-icons'


function renderTargets(targets) {
	if (targets instanceof Array) {
		return targets.map((target) => {
			return <div key={target}>{target}</div>;
		});
	}

	return targets;
}

class ActiveTaskEntry extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			buttonPressed: false
		}
	}

	render() {
		const { task } = this.props;

		return (
			<TableRow>
				<TableCell>{task.task_type}</TableCell>
				<TableCell><Text>{task.status}</Text></TableCell>
				<TableCell>{renderTargets(task.target)}</TableCell>
				<TableCell>{renderParams(task.params)}</TableCell>
				<TableCell>
                    <Button
						disabled={this.state.buttonPressed}
                        onClick={() => {
							this.props.cancelTask();
							this.setState({
								buttonPressed: true
							});
						}}
                        hoverIndicator={true}
                        icon={<Clear />}
                    />
                </TableCell>
			</TableRow>
		)
	}
}

export default ActiveTaskEntry;
