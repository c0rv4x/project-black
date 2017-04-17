import _ from 'lodash'
import React from 'react'
import { Button, DropdownButton, MenuItem } from 'react-bootstrap'


class ButtonsTasks extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		var i = 0;
		const menu_items = _.map(this.props.tasks, (x) => {
			i++;
			return <MenuItem key={i} eventKey={i} onClick={x.handler}>{x.name}</MenuItem>
		});

		return (
			<div>
				<DropdownButton bsStyle="default" title="Start Task" id="dropdown-basic">
					{menu_items}
				</DropdownButton>
			</div>
		)
	}

}

export default ButtonsTasks;
