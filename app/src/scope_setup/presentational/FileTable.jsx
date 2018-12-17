import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class FileTable extends React.Component {
	render() {
		const { files } = this.props;

		return (
			<Statistic>
				<Statistic.Value>{files.loaded && files.amount}{!files.loaded && "0"}</Statistic.Value>
				<Statistic.Label>files</Statistic.Label>
			</Statistic>
		)
	}
}

export default FileTable;
