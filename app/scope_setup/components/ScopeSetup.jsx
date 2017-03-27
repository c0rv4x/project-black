import React from 'react'

import { Table } from 'react-bootstrap'
import ScopeAdderTracked from '../../project_details/components/ScopeAdderTracked.jsx'

import IPTable from '../presentational/IPTable.jsx'
import HostTable from '../presentational/HostTable.jsx'

class ScopeSetup extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h4>Here you can add, delete, modify and work with initial scope of the project.</h4>
				<ScopeAdderTracked project={this.props.project}/>
				<hr />

				<IPTable ips={this.props.scopes.ips}/>
				<hr />

				<HostTable />
				<hr />
			</div>
		)
	}
}

export default ScopeSetup;