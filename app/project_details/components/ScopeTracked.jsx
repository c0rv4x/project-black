import React from 'react'

import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';

import ScopeAdder from '../presentational/scope/ScopeAdder.jsx'
import ScopeTable from './ScopeTable.jsx'

class ScopeTracked extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"newScopeInput": ""
		}

		this.scopesEmitter = new ScopesSocketioEventsEmitter();		

		this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
		this.submitNewScope = this.submitNewScope.bind(this);
		this.deleteScope = this.deleteScope.bind(this);
	}

	handleNewScopeChange(e) {
		this.setState({ newScopeInput: e.target.value });
	}

	submitNewScope(scopes) {
		this.scopesEmitter.requestCreateScope(this.props.project.project_uuid, scopes);
	}

	deleteScope(scope_id) {
		this.scopesEmitter.requestDeleteScope(scope_id);
	}

	render() {
		return (
			<div>
				<ScopeAdder newScopeInput={this.state.newScopeInput}
							handleNewScopeChange={this.handleNewScopeChange}
							onNewScopeClick={
						      (scopes) => this.submitNewScope(scopes)
			   			    } />

				<ScopeTable scopes={this.props.scopes.ips}
							onCommentChange={this.props.onCommentChange}
							deleteScope={this.deleteScope}

							scans={this.props.scans} />
			</div>
		)
	}

}


export default ScopeTracked;