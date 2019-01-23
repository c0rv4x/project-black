import _ from 'lodash'
import React from 'react'

import { Box, Stack, Heading, Text } from 'grommet'
import { Lock } from 'grommet-icons'


class Statistic extends React.Component {
	render() {
		const { number, text, locked } = this.props;

		return (
			<Stack anchor="center">
				<Box align="center">
					<Box>
						<Heading level="1" margin="none">{number}</Heading>
					</Box>
					<Box>
						<Text>{text}</Text>
					</Box>
				</Box>
				{ locked &&
					<Box
						background="rgba(0, 0, 0, 0.2)"
					>
						<Lock size="xlarge" />
					</Box>
				}
			</Stack>
		)
	}
}

export default Statistic;
