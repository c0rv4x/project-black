import _ from 'lodash'
import React from 'react'

import { Box, Text } from 'grommet'


class IPTable extends React.Component {
	render() {
		const { ips } = this.props;

		return (
			<Box>
				<Text>
					{ips.total_db_ips} ips
				</Text>
			</Box>
		)
	}
}

export default IPTable;
