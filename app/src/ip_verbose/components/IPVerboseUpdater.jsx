import React from 'react'

import IPVerbose from './IPVerbose.jsx'

import {
    Dimmer,
    Loader
} from 'semantic-ui-react'


class IPVerboseUpdater extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
        console.log(this.props.ip);
        const { loaded } = this.props.ip;

		return (
			<div>
                <Dimmer active={!loaded}>
					<Loader />
			    </Dimmer>
                <IPVerbose {...this.props} />
			</div>
		)
	}
}

export default IPVerboseUpdater;


