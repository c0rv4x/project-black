import _ from 'lodash'
import React from 'react'

import { Table, Button, Label, Transition } from 'semantic-ui-react'


class HostTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span>
				<Label size="large" color="blue">
					{this.props.hosts.total_db_hosts} hosts
				</Label>
			</span>
		)
	}
}

export default HostTable;
