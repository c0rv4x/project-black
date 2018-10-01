import _ from 'lodash'
import React from 'react'

import { Statistic } from 'semantic-ui-react'


class FileTable extends React.Component {
	render() {
		const { files } = this.props;

		return (
			<Statistic>
				<Statistic.Value>{files.loaded && files.amount}{!files.loaded && "Loading"}</Statistic.Value>
				<Statistic.Label>files</Statistic.Label>
			</Statistic>
		)
	}
}

export default FileTable;
