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
					<Modal.Title>Task</Modal.Title>
				</Modal.Header>

				<Modal.Body>

				</Modal.Body>

				<Modal.Footer>
					<Button onClick={this.props.close}>Close</Button>
				</Modal.Footer>
			</Modal>
		)
	}
}

export default TaskDetails;