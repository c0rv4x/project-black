import React from 'react'

import ScopesSocketioEventsEmitter from '../../../redux/scopes/ScopesSocketioEventsEmitter.js'

import ScopeUpload from './ScopeUpload.jsx'
import ScopeAdder from '../presentational/ScopeAdder.jsx'


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

	handleNewScopeChange(text) {
		this.setState({ newScopeInput: text });
	}

	submitNewScope(scopes) {
		this.scopesEmitter.requestCreateScope(scopes, this.props.project.project_uuid);
	}

	render() {
		return (
			<div>
				<ScopeAdder
					newScopeInput={this.state.newScopeInput}
					handleNewScopeChange={(e) => {
						this.handleNewScopeChange(e.target.value)
					}}
					onNewScopeClick={
						(scopes) => {
							this.submitNewScope(scopes);
							this.setState({
								"newScopeInput": ""
							});
						}
					}
					scopesCreated={this.props.scopesCreated}
					project_uuid={this.props.project.project_uuid}
				/>
				<ScopeUpload
					fileLoadedHandler={this.handleNewScopeChange}
				>
					Upload scope
				</ScopeUpload>
			</div>
		)
	}

}


export default ScopeAdderTracked;
