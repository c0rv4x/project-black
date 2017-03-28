import React from 'react'
import { Table } from 'react-bootstrap'

import ScopeAdderTracked from '../../project_details/components/ScopeAdderTracked.jsx'
import HeadButtonsTracked from './HeadButtonsTracked.jsx'
import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js'

import IPTable from '../presentational/IPTable.jsx'
import HostTable from '../presentational/HostTable.jsx'


class ScopeSetup extends React.Component {
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
			<div>
				<h4>Here you can add, delete, modify and work with initial scope of the project.</h4>
				<HeadButtonsTracked project={this.props.project} />
				<ScopeAdderTracked project={this.props.project} />
				<hr />

				<IPTable ips={this.props.scopes.ips}
						 delete={this.deleteScope} />
				<hr />

				<HostTable hosts={this.props.scopes.hosts}
						   delete={this.deleteScope} />
				<hr />
			</div>
		)
	}
}

export default ScopeSetup;