import React from 'react'

import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import PortsTabs from '../presentational/PortsTabs.jsx'

import {
	Divider,
	Header
} from 'semantic-ui-react'

import HostsSocketioEventsEmitter from '../../redux/hosts/HostsSocketioEventsEmitter'


class HostVerbose extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'activeTabNumber': null,
			'activePortNumber': null
		}

		this.emitter = new HostsSocketioEventsEmitter();

		if (this.props.update_needed) {
			this.emitter.requestRenewHosts({'host': [this.props.host.hostname]});
		}

		this.tabChange = this.tabChange.bind(this);
		this.commentSubmitted = this.commentSubmitted.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if (JSON.stringify(this.props.ports) !== JSON.stringify(newProps.ports)) {
			if (typeof this.state.activePortNumber === 'undefined') {
				this.setState({
					activePortNumber: newProps.ports[0].port_number,
					activeTabNumber: 0
				});
			}		
		}

		if (newProps.update_needed) {
			this.emitter.requestRenewHosts(this.props.project_uuid, {'host': [this.props.host.hostname]});
		}
	}

	tabChange(newNumber) {
		this.setState({
			activeTabNumber: newNumber,
			activePortNumber: this.props.ports[newNumber].port_number
		});
	}

	commentSubmitted(comment, _id) {
		this.emitter.requestUpdateHost(comment, _id, this.props.project_uuid, "host");
	}

	render() {
		const { host, ports, files, stats } = this.props;

		return (
			<div>
				<Divider hidden />
				<Header as="h2">{host.hostname}</Header>
				<Divider hidden />

				<ScopeComment comment={host.comment}
							  onCommentSubmit={(value) => this.commentSubmitted(value, host.host_id)} />

				<PortsTabs ports={ports}
					   	   activeTabNumber={this.state.activeTabNumber}
						   tabChange={this.tabChange}
						   stats={stats}
					   	   files={files} />
			</div>				  
		)
	}
}

export default HostVerbose;
