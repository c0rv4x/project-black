import _ from 'lodash'
import React from 'react'

import ScopeSetup from './ScopeSetup.jsx'


class ScopeSetupUpdater extends React.Component {
	render() {
		return (
			<ScopeSetup {...this.props} />
		)
	}
}

export default ScopeSetupUpdater;