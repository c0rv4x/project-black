import _ from 'lodash'
import React from 'react'

import { Box, Text } from 'grommet'


class ScanTable extends React.Component {
	render() {
		const { scans } = this.props;

		return (
			<Box>
				<Text>
					{scans.amount} ports
				</Text>
			</Box>
		)
	}
}

export default ScanTable;
