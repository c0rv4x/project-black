import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class IPTable extends React.Component {
	render() {
		const { ips } = this.props;

		return (
			<Statistic>
				<Statistic.Value>{ips.loaded && ips.total_db_ips}{!ips.loaded && "Loading"}</Statistic.Value>
				<Statistic.Label>ips</Statistic.Label>
			</Statistic>
		)
	}
}

export default IPTable;
