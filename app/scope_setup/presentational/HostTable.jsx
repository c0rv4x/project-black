import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class HostTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Statistic>
				<Statistic.Value>{this.props.hosts.total_db_hosts}</Statistic.Value>
				<Statistic.Label>hosts</Statistic.Label>
			</Statistic>			
		)
	}
}

export default HostTable;
