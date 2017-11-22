import React from 'react'

import { Dimmer, Loader, Segment } from 'semantic-ui-react'
import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'

import IPTable from './IPTable.jsx'

class IPTableTracked extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: false
		}

		this.scopesEmitter = new ScopesSocketioEventsEmitter();		

		this.setLoading = this.setLoading.bind(this);
		this.deleteScope = this.deleteScope.bind(this);
	}

	setLoading(value) {
		this.setState({
			loading: value
		});
	}

	deleteScope(scope_id) {
		this.scopesEmitter.requestDeleteScope(scope_id, this.props.project_uuid);
	}

	render() {
		return (
			<Segment vertical>
				<Dimmer active={this.state.loading}>
					<Loader />
				</Dimmer>

				<IPTable ips={this.props.ips}
						 project_uuid={this.props.project_uuid}
						 deleteScope={this.deleteScope}
						 onFilterChange={this.props.onFilterChange}
						 setLoading={this.setLoading}/>
			</Segment>
		)
	}

}


export default IPTableTracked;
