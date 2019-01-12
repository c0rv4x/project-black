import _ from 'lodash'
import React from 'react'

import HostVerbose from './HostVerbose.jsx'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'

import Loading from '../../common/loading/Loading.jsx'


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
				<Loading
					componentLoading={!loaded}
				>
					<HostVerbose
						loaded={loaded}
						{...this.props}
					/>
				</Loading>
			</div>				  
		)
	}
}

export default HostVerboseUpdater;
