import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class IPTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Statistic>
				<Statistic.Value>{this.props.ips.total_db_ips}</Statistic.Value>
				<Statistic.Label>ips</Statistic.Label>
			</Statistic>
		)
	}
}

export default IPTable;
