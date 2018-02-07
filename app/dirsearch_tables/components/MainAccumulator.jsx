import React from 'react'

import { Header } from 'semantic-ui-react'

import MainTable from './MainTable.jsx'


class MainAccumulator extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { ips, hosts, project } = this.props;

		return (
			<div>
				<Header as="h2">{project.project_name}</Header>
				<MainTable ips={ips}
						   hosts={hosts} />
			</div>
		)
	}
}

export default MainAccumulator;