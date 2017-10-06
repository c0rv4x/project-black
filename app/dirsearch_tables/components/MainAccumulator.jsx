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
				<MainTable />
			</div>
		)
	}
}

export default MainAccumulator;