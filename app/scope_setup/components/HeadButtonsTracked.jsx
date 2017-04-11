import React from 'react'
import { Button } from 'react-bootstrap'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import HeadButtons from '../presentational/HeadButtons.jsx'

class HeadButtonsTracked extends React.Component {
	constructor(props) {
		super(props);

		this.scopesEmitter = new ScopesSocketioEventsEmitter();

		this.resolveScopes = this.resolveScopes.bind(this);
	}

	resolveScopes(scopes_ids, project_uuid) {
		this.scopesEmitter.requestResolveScopes(scopes_ids, project_uuid);
	}

	render() {
		return (
			<div>
				<HeadButtons project={this.props.project}
							 resolveScopes={this.resolveScopes}/>
			</div>
		)
	}
}

export default HeadButtonsTracked;