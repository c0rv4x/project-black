import _ from 'lodash'
import React from 'react'

import HostVerbose from './HostVerbose.jsx'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'

import Loading from '../../common/loading/Loading.jsx'


class HostVerboseUpdater extends React.Component {
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
