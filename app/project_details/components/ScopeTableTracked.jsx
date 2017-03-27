import React from 'react'

import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';

import ScopeTable from './ScopeTable.jsx'

class ScopeTableTracked extends React.Component {

	constructor(props) {
		super(props);

		this.scopesEmitter = new ScopesSocketioEventsEmitter();		

		this.deleteScope = this.deleteScope.bind(this);
	}

	deleteScope(scope_id) {
		this.scopesEmitter.requestDeleteScope(scope_id);
	}

	render() {
		return (
				<ScopeTable scopes={this.props.scopes.ips}
							onCommentChange={this.props.onCommentChange}
							deleteScope={this.deleteScope}

							scans={this.props.scans} />
		)
	}

}


export default ScopeTableTracked;