import React from 'react'

import MainTable from './MainTable.jsx'


class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h2>{this.props.project.project_name}</h2>
				<MainTable ips={this.props.ips}
						   hosts={this.props.hosts}
						   files={this.props.files} />
			</div>
		)
	}
}

export default MainAccumulator;