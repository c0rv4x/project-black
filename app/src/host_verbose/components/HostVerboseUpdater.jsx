import React from 'react'

import HostVerbose from './HostVerbose.jsx'

import {
	Dimmer,
	Loader
} from 'semantic-ui-react'


class HostVerboseUpdater extends React.Component {
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
