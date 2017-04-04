import React from 'react'

import ScopeComment from '../../project_details/presentational/scope/ScopeComment.jsx'
import PortsTabs from './PortsTabs.jsx'

class Main extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h2>{this.props.host.hostname}</h2>
				<hr />
				<ScopeComment commentValue={this.props.host.comment} />

				<PortsTabs ports={this.props.ports} />
			</div>
		)
	}
}

export default Main;