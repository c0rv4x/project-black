import React from 'react'
import PropTypes from 'prop-types'

import ScopeAdder from '../presentational/ScopeAdder.jsx'
import { requestCreateScope } from '../../../../redux/scopes/actions.js'


class ScopeAdderTracked extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			"newScopeInput": ""
		}

		this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
		this.submitNewScope = this.submitNewScope.bind(this);
	}

	handleNewScopeChange(text) {
		this.setState({ newScopeInput: text });
	}

	submitNewScope(scopes) {
		this.context.store.dispatch(requestCreateScope(this.props.project.project_uuid, scopes));
	}

	render() {
		return (
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
		)
	}

}

ScopeAdderTracked.contextTypes = {
    store: PropTypes.object
}

export default ScopeAdderTracked;
