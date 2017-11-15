import _ from 'lodash'
import React from 'react'

import { Table, Button, Label, Transition } from 'semantic-ui-react'


class IPTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span>
				<Label size="large" color="blue">
					{this.props.ips.total_db_ips} ips
				</Label>
			</span>
		)
	}
}

export default IPTable;
