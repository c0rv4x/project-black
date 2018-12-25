import _ from 'lodash'
import React from 'react'

import HostVerbose from './HostVerbose.jsx'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'

import {
	Dimmer,
	Loader
} from 'semantic-ui-react'


class HostVerboseUpdater extends React.Component {
	constructor(props) {
		super(props);

		this.requestStatsHost = this.requestStatsHost.bind(this);
	}

	componentDidMount() {
		this.filesEmitter = new FilesSocketioEventsEmitter();
	}

	componentDidUpdate(prevProps) {
		if (!_.isEqual(this.props.host, prevProps.host)) {
			this.requestStatsHost();
		}
	}

	requestStatsHost(host=this.props.host) {
		this.filesEmitter.requestStatsHost(this.props.project_uuid, [host.host_id]);
	}

	render() {
        const { loaded } = this.props.host;

		return (
			<div>
                <Dimmer active={!loaded}>
					<Loader />
			    </Dimmer>

				<HostVerbose
					loaded={loaded}
					{...this.props}
				/>                
			</div>				  
		)
	}
}

export default HostVerboseUpdater;
