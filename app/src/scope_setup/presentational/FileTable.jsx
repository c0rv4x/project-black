import _ from 'lodash'
import React from 'react'

import { Box, Text } from 'grommet'


class FileTable extends React.Component {
	render() {
		const { files } = this.props;

		return (
			<Box>
				<Text>
					{files.amount} files
				</Text>
			</Box>
		)
	}
}

export default FileTable;
