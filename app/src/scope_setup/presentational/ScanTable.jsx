import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class ScanTable extends React.Component {
	render() {
		const { scans } = this.props;

		return (
			<Statistic>
				<Statistic.Value>{scans.loaded && scans.amount}{!scans.loaded && "0"}</Statistic.Value>
				<Statistic.Label>ports</Statistic.Label>
			</Statistic>
		)
	}
}

export default ScanTable;
