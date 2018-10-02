import React from 'react'

import IPVerbose from './IPVerbose.jsx'

import {
    Dimmer,
    Loader
} from 'semantic-ui-react'


class IPVerboseUpdater extends React.Component {
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


