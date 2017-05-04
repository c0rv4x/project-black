import _ from 'lodash'
import React from 'react'
import { Button, Modal, MenuItem, OverlayTrigger, Popover } from 'react-bootstrap'

import CustomOptions from './CustomOptions.jsx'


class TasksOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showModal: false
		}

		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.startTask = this.startTask.bind(this);
	}

	close() {
		this.setState({ showModal: false });
	}	

	open() {
		this.setState({ showModal: true });
	}

	startTask(options) {
		this.props.task.handler(options)
		this.close()
	}

	render() {
		const startButtons = _.map(this.props.task.preformed_options, (x) => {
			var options = [];
			_.forOwn(x.options, (value, key) => {
				options.push(<div key={key}><strong>{key}:</strong> {value}</div>);
			});


			const popover = (
				<Popover id="popover-trigger-hover-focus" title="Options">
					{options}
				</Popover>
			);

			return (
			    <OverlayTrigger key={x.name} trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
					<Button onClick={() => this.startTask(x.options)}>{x.name}</Button>
			    </OverlayTrigger>
			)
		});

		return ( 
			<MenuItem key={this.props.number}
					  eventKey={this.props.number}
					  onClick={this.open} >
				{this.props.task.name}
				<Modal show={this.state.showModal} onHide={this.close} >
					<Modal.Header closeButton>
						<Modal.Title>Prepared settings</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>Choose one of the prepared options or create your own</h4>
						{startButtons}
						<hr />
						<CustomOptions available_options={this.props.task.available_options} />
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.close}>Close</Button>
					</Modal.Footer>
				</Modal>
			</MenuItem>
		)
	}
}

export default TasksOptions;