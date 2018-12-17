import _ from 'lodash'
import React from 'react'

import {
    Label
} from 'semantic-ui-react'


class Files extends React.Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (!_.isEqual(nextProps['ip'], this.props['ip'])) || (!_.isEqual(this.state, nextState));
	}

    render() {
		const { target } = this.props;

		let files_by_statuses = {
			'2xx': 0,
			'3xx': 0,
			'4xx': 0,
			'5xx': 0
		}

		for (let port_number of Object.keys(target.files)) {
			for (let status_code of Object.keys(target.files[port_number])) {
				if (Math.floor(status_code / 100) === 3) {
					files_by_statuses['3xx'] += target.files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 4) {
					files_by_statuses['4xx'] += target.files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 5) {
					files_by_statuses['5xx'] += target.files[port_number][status_code];
				}
				else if (Math.floor(status_code / 100) === 2) {
					files_by_statuses['2xx'] += target.files[port_number][status_code];
				}
			}
        }
        
        const labels = _.map(files_by_statuses, (value, key) => {
            if (value) {
                return <Label key={key}>{key}<Label.Detail>{value}</Label.Detail></Label>
            }
        });

		return (
            <div>
                {labels}
            </div>
		)
	}
}

export default Files;