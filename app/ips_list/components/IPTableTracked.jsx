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
		this.scopesEmitter.requestDeleteScope(scope_id, this.props.project_uuid);
	}

	render() {
		return (
				<IPTable ips={this.props.scopes}
						 project_uuid={this.props.project_uuid}
						 deleteScope={this.deleteScope}
						 onFilterChange={this.props.onFilterChange} />
		)
	}

}


export default IPTableTracked;
