import React from 'react'
import _ from 'lodash'

import {
	Box,
	Grid,
	Heading
} from 'grommet'


class FilesStats extends React.Component {
	render() {
        const { targetId, files } = this.props;

		let files_by_statuses = {
			'2xx': 0,
			'3xx': 0,
			'4xx': 0,
			'5xx': 0
        }
        
        const colors = {
            '2xx': 'neutral-1',
			'3xx': 'none',
			'4xx': 'neutral-4',
			'5xx': 'none'
        }

		for (let port_number of Object.keys(files)) {
			for (let status_code of Object.keys(files[port_number])) {
				if (Math.floor(status_code / 100) === 3) {
					files_by_statuses['3xx'] += files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 4) {
					files_by_statuses['4xx'] += files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 5) {
					files_by_statuses['5xx'] += files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 2) {
					files_by_statuses['2xx'] += files[port_number][status_code];
				}
			}
        }

        let filesBoxes = [];
        let i = 1;
        _.forOwn(files_by_statuses, (count, statusCodeMask) => {
            if (count > 0) {
                filesBoxes.push(
                    <Box
                        gridArea={"files" + i + "-" + targetId}
                        key={"files" + i + "-" + targetId}
                        margin="xxsmall"
                        border={{
                            size: "xsmall",
                            color: colors[statusCodeMask]
                        }}
                        round="xsmall"
                    >
                        {statusCodeMask}: {count}
                    </Box>
                );

                i++;
            }
        }) 

        return (
            <Grid
                areas={[
                    { name: 'files1-' + targetId, start: [0, 0], end: [0, 0] },
                    { name: 'files2-' + targetId, start: [1, 0], end: [1, 0] },
                    { name: 'files3-' + targetId, start: [0, 1], end: [0, 1] },
                    { name: 'files4-' + targetId, start: [1, 1], end: [1, 1] },
                ]}
                columns={["auto", "auto"]}
                rows={["auto", "auto"]}
                align="center"
            >
                {filesBoxes}
            </Grid>
        )
    }
}

export default FilesStats;
