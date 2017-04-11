import React from 'react'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'

import ScopeAdder from '../presentational/scope/ScopeAdder.jsx'

class ScopeAdderTracked extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"newScopeInput": ""
		}

		this.scopesEmitter = new ScopesSocketioEventsEmitter();		

		this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
		this.submitNewScope = this.submitNewScope.bind(this);
	}

	handleNewScopeChange(e) {
		this.setState({ newScopeInput: e.target.value });
	}

	submitNewScope(scopes) {
		this.scopesEmitter.requestCreateScope(this.props.project.project_uuid, scopes);
	}

	render() {
		return (
			<ScopeAdder newScopeInput={this.state.newScopeInput}
						handleNewScopeChange={this.handleNewScopeChange}
						onNewScopeClick={
					      (scopes) => this.submitNewScope(scopes)
		   			    } />
		)
	}

}


export default ScopeAdderTracked;