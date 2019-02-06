import React from 'react'
import PropTypes from 'prop-types'

import ScopesSocketioEventsEmitter from '../../../redux/scopes/ScopesSocketioEventsEmitter.js'

import ScopeAdder from '../presentational/ScopeAdder.jsx'


class ScopeAdderTracked extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"newScopeInput": ""
		}

		this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
		this.submitNewScope = this.submitNewScope.bind(this);
	}

	componentDidMount() {
		this.scopesEmitter = new ScopesSocketioEventsEmitter();		
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
					handleNewScopeChange={(value) => {
						this.handleNewScopeChange(value)
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
			</div>
		)
	}

}

ScopeAdderTracked.contextTypes = {
    store: PropTypes.object
}

export default ScopeAdderTracked;
