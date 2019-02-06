import React from 'react'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'

import IPTable from './IPTable.jsx'

class IPTableTracked extends React.Component {

	constructor(props) {
		super(props);

		this.deleteScope = this.deleteScope.bind(this);
	}

	componentDidMount() {
		this.scopesEmitter = new ScopesSocketioEventsEmitter();		
	}

	deleteScope(scope_id) {
		this.scopesEmitter.requestDeleteScope(scope_id, this.props.project_uuid, "ip_address");
	}

	render() {
		return (
			<IPTable
				ips={this.props.ips}
				project_uuid={this.props.project_uuid}
				deleteScope={this.deleteScope}
				applyFilters={this.props.applyFilters}
				renewIps={this.props.renewIps}
			/>
		)
	}

}


export default IPTableTracked;
