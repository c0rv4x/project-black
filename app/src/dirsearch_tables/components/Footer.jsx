import _ from 'lodash'
import React from 'react'

import {
	Box,
    Button,
    Grid,
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
	TableFooter
} from 'grommet'
import {
	Add
} from 'grommet-icons'


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
            >
                <Box gridArea="labels" direction="row">
                    {stats[200] && 
                        <Box
                            border={{size: "small", color: "status-ok"}}
                            pad="xxsmall"
                            round="xsmall"
                        >
                            {stats[200]}x 200
                        </Box>
                    }
                    {stats[301] && 
                        <Box
                            border={{size: "small", color: "dark-1"}}
                            pad="xxsmall"
                            round="xsmall"
                        >
                            {stats[301]}x 301
                        </Box>
                    }
                    {stats[302] && 
                        <Box
                            border={{size: "small", color: "dark-1"}}
                            pad="xxsmall"
                            round="xsmall"
                        >
                            {stats[302]}x 302
                        </Box>
                    }																
                    {stats[400] && 
                        <Box
                            border={{size: "small", color: "dark-1"}}
                            pad="xxsmall"
                            round="xsmall"
                        >
                            {stats[400]}x 400
                        </Box>
                    }						
                    {stats[401] && 
                        <Box
                            border={{size: "small", color: "status-warning"}}
                            pad="xxsmall"
                            round="xsmall"
                        >
                            {stats[401]}x 401
                        </Box>
                    }								
                    <Box
                        border={{size: "small", color: "dark-1"}}
                        pad="xxsmall"
                        round="xsmall"
                    >
                        {stats.total} files
                    </Box>
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