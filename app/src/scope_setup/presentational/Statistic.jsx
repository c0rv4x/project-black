import _ from 'lodash'
import React from 'react'

import { Box, Grid, Heading, Text } from 'grommet'


class Statistic extends React.Component {
	render() {
		const { number, text } = this.props;

		return (
			<Box align="center">
				<Grid
					areas={[
						{ name: 'number', start: [0, 0], end: [0, 0] },
						{ name: 'text', start: [0, 1], end: [0, 1] },
					]}
					columns={['auto']}
					rows={['auto', 'auto']}
					gap='none'
				>
					<Box gridArea='number' align="center">
						<Heading level="2" margin="none">{number}</Heading>
					</Box>
					<Box gridArea='text' align="center">
						<Text>{text}</Text>
					</Box>
				</Grid>
			</Box>
		)
	}
}

export default Statistic;
