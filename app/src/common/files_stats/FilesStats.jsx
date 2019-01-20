import React from 'react'
import _ from 'lodash'

import {
	Box
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
			'4xx': 'none',
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
                        key={"files" + i + "-" + targetId}
                        margin="xxsmall"
                        border={{
                            size: "2px",
                            color: colors[statusCodeMask]
                        }}
                        round="xsmall"
                        pad="xxsmall"
                    >
                        {statusCodeMask}: {count}
                    </Box>
                );

                i++;
            }
        }) 

        return (
            <Box
                align="center"
            >
                {filesBoxes}
            </Box>
        )
    }
}

export default FilesStats;
