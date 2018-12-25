import _ from 'lodash'
import React from 'react'

import IPVerbose from './IPVerbose.jsx'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'

import {
    Dimmer,
    Loader
} from 'semantic-ui-react'


class IPVerboseUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.requestStatsIP = this.requestStatsIP.bind(this);
	}

	componentDidMount() {
		this.filesEmitter = new FilesSocketioEventsEmitter();
	}

	componentDidUpdate(prevProps) {
		if (!_.isEqual(this.props.ip, prevProps.ip)) {
			this.requestStatsIP();
		}
	}

	requestStatsIP(ip=this.props.ip) {
		this.filesEmitter.requestStatsIPs(this.props.project_uuid, [ip.ip_id]);
	}

	render() {
        const { loaded } = this.props.ip;

		return (
			<div>
                <Dimmer active={!loaded}>
					<Loader />
			    </Dimmer>

				<IPVerbose
					loaded={loaded}
					{...this.props}
				/>
			</div>
		)
	}
}

export default IPVerboseUpdater;


