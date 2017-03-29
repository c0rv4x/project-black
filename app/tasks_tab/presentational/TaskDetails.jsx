import _ from 'lodash'
import React from 'react'

import { Modal, Button } from 'react-bootstrap'


class TaskDetails extends React.Component {
	constructor(props) {
		super(props);
	}
    
	render() {
		return (
			<Modal show={this.props.showModal} onHide={this.props.close}>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.task.task_type} on {this.props.task.date_added} : {this.props.task.status}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<h4>Targets</h4>
					{_.map(this.props.task.target, (x) => {return <div key={x}>{x}</div>})}

					<h4>Params</h4>
					{_.map(this.props.task.params, (x) => {return <div key={x}>{x}</div>})}

					<h4>Stdout</h4>
					<div><code>{this.props.task.stdout}</code></div>

					<h4>Stderr</h4>
					<div><code>{this.props.task.stderr}</code></div>
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={this.props.close}>Close</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

export default TaskDetails;