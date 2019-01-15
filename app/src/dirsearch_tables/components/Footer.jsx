import _ from 'lodash'
import React from 'react'

import {
	Box,
    Button,
    Grid
} from 'grommet'
import {
	Add
} from 'grommet-icons'

import generateFiles from '../presentational/FileStatsOverview.jsx'


class Footer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: true
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state));
	}

	componentDidUpdate(prevProps, prevState) {
		if (!_.isEqual(prevProps.files, this.props.files)) {
			this.setState({
				loaded: true
			});
		}
	}

	render() {
        const { stats, target_id, port_number, got_files } = this.props;

        return (
            <Grid
                areas={[
                    { name: 'labels', start: [0, 0], end: [0, 0] },
                    { name: 'empty', start: [1, 0], end: [1, 0] },
                    { name: 'buttons', start: [2, 0], end: [2, 0] },
                ]}
                columns={['small', 'medium', 'auto']}
                rows={['auto']}
                gap='small'
                margin="xsmall"
            >
                <Box gridArea="labels" direction="row">							
                    {generateFiles(stats, target_id)}
                </Box>
                <Box gridArea="buttons" direction="row" justify="end" gap="small">
                    <Button
                        plain
                        size="small"
                        disabled={got_files.length >= stats.total}
                        alignSelf="center"
                        icon={<Add />}
                        label="Load 1"
                        onClick={() => {
                            this.props.requestMore(target_id, port_number, 1, got_files.length);
                        }}
                    />
                    <Button
                        alignSelf="end"
                        plain
                        size="small"
                        disabled={got_files.length >= stats.total}
                        alignSelf="center"
                        icon={<Add />}
                        label="Load 100"
                        onClick={() => {
                            // TODO: target_id and port_number can be set via the wrapping component
                            this.props.requestMore(target_id, port_number, 100, got_files.length);
                        }}
                    />
                </Box>
            </Grid>
        )
	}
}

export default Footer;