import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class FileTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Statistic>
				<Statistic.Value>{this.props.files.amount}</Statistic.Value>
				<Statistic.Label>files</Statistic.Label>
			</Statistic>
		)
	}
}

export default FileTable;
