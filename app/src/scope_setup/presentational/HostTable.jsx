import _ from 'lodash'
import React from 'react'

import { Box, Text } from 'grommet'


class HostTable extends React.Component {
	render() {
		const { hosts } = this.props;

		return (
			<Box>
				<Text>
					{hosts.total_db_hosts} hosts
				</Text>
			</Box>
		)
	}
}

export default HostTable;
