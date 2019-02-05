import React from 'react'

import IPsSocketioEventsEmitter from '../../redux/ips/IPsSocketioEventsEmitter.js'
import FilesSocketioEventsEmitter from '../../redux/files/FilesSocketioEventsEmitter.js'
import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import PortsTabs from '../../host_verbose/presentational/PortsTabs.jsx'

import { Heading } from 'grommet'

class IPVerbose extends React.Component {
	constructor(props) {
		super(props);

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.getFilesIPs = this.getFilesIPs.bind(this);
	}

	componentDidMount() {
		this.ipsEmitter = new IPsSocketioEventsEmitter();		
		this.filesEmitter = new FilesSocketioEventsEmitter();
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

	commentSubmitted(comment, _id) {
		this.ipsEmitter.requestUpdateIP(comment, _id, this.props.project_uuid, 'ip_address');
	}

	render() {
		let { ip, ports, files, stats } = this.props;

		return (
			<div>
				<Heading level="2">{ip.ip_address}</Heading>

				<ScopeComment
					comment={ip.comment}
					onCommentSubmit={(value) => this.commentSubmitted(value, ip.ip_id)} />

				<PortsTabs
					loaded={this.props.loaded}
					stats={stats}
					target={ip.ip_address}
					target_id={ip.ip_id}
					ports={ports}
					files={files}
					requestMoreFiles={this.getFilesIPs}
				/>
			</div>
		)
	}
}

export default IPVerbose;