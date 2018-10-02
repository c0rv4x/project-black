import React from 'react'

import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import PortsTabs from '../../host_verbose/presentational/PortsTabs.jsx'


import { Divider } from "semantic-ui-react"

class IPVerbose extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'activeTabNumber': null,
			'activePortNumber': null
		}		

		this.ipsEmitter = new IPsSocketioEventsEmitter();		

		if (this.props.update_needed) {
			this.ipsEmitter.requestSingleIPs(this.props.project_uuid, this.props.ip.ip_address);
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
			this.ipsEmitter.requestSingleIPs(this.props.project_uuid, this.props.ip.ip_address);
		}		
	}

	tabChange(newNumber, portNumber) {
		this.setState({
			activeTabNumber: newNumber,
			activePortNumber: portNumber
		});
	}

	commentSubmitted(comment, _id) {
		this.ipsEmitter.requestUpdateIP(comment, _id, this.props.project_uuid, 'ip_address');
	}

	render() {
		let { ip, ports } = this.props;

		return (
			<div>
				<Divider hidden />
				<h2>{ip.ip_address}</h2>
				<Divider hidden />

				<ScopeComment
					comment={ip.comment}
					onCommentSubmit={(value) => this.commentSubmitted(value, ip.ip_id)} />

				<PortsTabs
					loaded={this.props.loaded}
					ports={ports}
					activeTabNumber={this.state.activeTabNumber}
					tabChange={this.tabChange}
					files={ip.files}
				/>
			</div>
		)
	}
}

export default IPVerbose;