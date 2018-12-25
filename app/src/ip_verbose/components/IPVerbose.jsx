import React from 'react'

import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'
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

		this.tabChange = this.tabChange.bind(this);
		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.getFilesIPs = this.getFilesIPs.bind(this);
	}

	componentDidMount() {
		this.ipsEmitter = new IPsSocketioEventsEmitter();		
		this.filesEmitter = new FilesSocketioEventsEmitter();

		if (this.props.update_needed) {
			this.ipsEmitter.requestSingleIPs(this.props.project_uuid, this.props.ip.ip_address);
		}
	}

	getFilesIPs(host, port_number, limit=3, offset=0) {
		this.filesEmitter.requestFilesIps(
			this.props.project_uuid,
			host,
			port_number,
			limit,
			offset
		);
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
		let { ip, ports, files, stats } = this.props;

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
					stats={stats}
					target={ip.ip_address}
					target_id={ip.ip_id}
					ports={ports}
					activeTabNumber={this.state.activeTabNumber}
					tabChange={this.tabChange}
					files={files}
					requestMoreFiles={this.getFilesIPs}
				/>
			</div>
		)
	}
}

export default IPVerbose;