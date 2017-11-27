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
		this.props.setLoading(true);
		this.scopesEmitter.requestDeleteScope(scope_id, this.props.project_uuid, "ip_address");
	}

	render() {
		return (
			<IPTable ips={this.props.ips}
					 hosts={this.props.hosts}
					 project_uuid={this.props.project_uuid}
					 deleteScope={this.deleteScope}
					 onFilterChange={this.props.onFilterChange}
					 setLoading={this.props.setLoading}/>
		)
	}

}


export default IPTableTracked;
