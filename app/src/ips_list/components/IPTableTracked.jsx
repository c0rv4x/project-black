import React from 'react'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'

import IPTable from './IPTable.jsx'

class IPTableTracked extends React.Component {

	constructor(props) {
		super(props);

		this.scopesEmitter = new ScopesSocketioEventsEmitter();		

		this.deleteScope = this.deleteScope.bind(this);
	}

	deleteScope(scope_id) {
		this.props.setLoaded(false);
		this.scopesEmitter.requestDeleteScope(scope_id, this.props.project_uuid, "ip_address");
	}

	render() {
		return (
			<IPTable ips={this.props.ips}
					 project_uuid={this.props.project_uuid}
					 deleteScope={this.deleteScope}
					 applyFilters={this.props.applyFilters}
					 setLoaded={this.props.setLoaded}
					 renewIps={this.props.renewIps} />
		)
	}

}


export default IPTableTracked;
