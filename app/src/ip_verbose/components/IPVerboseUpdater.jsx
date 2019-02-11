import _ from 'lodash'
import React from 'react'

import IPVerbose from './IPVerbose.jsx'

import Loading from '../../common/loading/Loading.jsx'


class IPVerboseUpdater extends React.Component {
	render() {
        const { loaded } = this.props.ip;

		return (
			<div>
				<Loading
					componentLoading={!loaded}
				>
					<IPVerbose
						loaded={loaded}
						{...this.props}
					/>
				</Loading>
			</div>
		)
	}
}

export default IPVerboseUpdater;


