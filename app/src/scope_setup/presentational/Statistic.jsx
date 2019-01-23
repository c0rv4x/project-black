import _ from 'lodash'
import React from 'react'

import { Box, Stack, Heading, Text } from 'grommet'
import { Lock } from 'grommet-icons'


class Statistic extends React.Component {
	render() {
		const { number, text } = this.props;

		return (
			<Box align="center">
				<Box>
					<Heading level="1" margin="none">{number}</Heading>
				</Box>
				<Box>
					<Text>{text}</Text>
				</Box>
			</Box>
		)
	}
}

export default Statistic;
