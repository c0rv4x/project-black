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
					<Modal.Title>{this.props.task.task_type} on {this.props.task.date_added}</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<h4>Targets</h4>
					{_.map(this.props.task.target, (x) => {return <div key={x}>{x}</div>})}
				</Modal.Body>

				<Modal.Footer>
					<Button onClick={this.props.close}>Close</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

export default TaskDetails;