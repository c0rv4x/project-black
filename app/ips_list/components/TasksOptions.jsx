import _ from 'lodash'
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, DropdownItem } from 'reactstrap'

import CustomOptions from "./CustomOptions.jsx"


class TasksOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modal: false,
			inputs: {}
		}

		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			modal: true
	    }, function () {
	    	console.log("updated",this.state);
	    });

	}	

	render() {
		// const startButtons = _.map(this.props.task.preformed_options, (x) => {
		// 	var options = [];
		// 	_.forOwn(x.options, (value, key) => {
		// 		options.push(<div key={key}><strong>{key}:</strong> {value}</div>);
		// 	});

		// 	const popover = (
		// 		<Popover id="popover-trigger-hover-focus" title="Options">
		// 			{options}
		// 		</Popover>
		// 	);

		// 	return (
		// 	    <OverlayTrigger key={x.name} trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
		// 			<Button onClick={() => this.loadOptions(x.options)}>{x.name}</Button>
		// 	    </OverlayTrigger>
		// 	)

		// 				{startButtons}
		// 				<hr />
		// 				<CustomOptions inputs={this.state.inputs}
		// 							   startTaskHandler={this.startTask}
		// 							   onInputChange={this.onInputChange} />			
		// });

		return ( 
			<DropdownItem key={this.props.number}
						  onClick={this.toggle} >

				{this.props.task.name}

			</DropdownItem>
		)
	}
}

export default TasksOptions;