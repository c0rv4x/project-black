import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class HostTable extends React.Component {
	render() {
		const { hosts } = this.props;

		return (
			<Statistic>
				<Statistic.Value>{hosts.loaded && hosts.total_db_hosts}{!hosts.loaded && "Loading"}</Statistic.Value>
				<Statistic.Label>hosts</Statistic.Label>
			</Statistic>			
		)
	}
}

export default HostTable;
