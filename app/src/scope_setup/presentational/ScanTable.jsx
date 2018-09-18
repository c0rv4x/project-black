import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class ScanTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Statistic>
				<Statistic.Value>{this.props.scans.amount}</Statistic.Value>
				<Statistic.Label>ports</Statistic.Label>
			</Statistic>
		)
	}
}

export default ScanTable;
