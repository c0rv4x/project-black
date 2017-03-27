import React from 'react'

import ScopeAdderTracked from '../../project_details/components/ScopeAdderTracked.jsx'


class ScopeSetup extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h4>Here you can add, delete, modify and work with initial scope of the project.</h4>
				<ScopeAdderTracked />
			</div>
		)
	}
}

export default ScopeSetup;