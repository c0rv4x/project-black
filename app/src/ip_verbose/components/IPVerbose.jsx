import React from 'react'
import PropTypes from 'prop-types'

import ScopeComment from '../../common/scope_comment/ScopeComment.jsx'
import PortsTabs from '../../host_verbose/presentational/PortsTabs.jsx'

import { requestUpdateIPComment } from '../../redux/ips/actions.js'
import { requestFilesIP } from '../../redux/files/actions.js'

import { Heading } from 'grommet'

class IPVerbose extends React.Component {
	constructor(props) {
		super(props);

		this.commentSubmitted = this.commentSubmitted.bind(this);
		this.getFilesIPs = this.getFilesIPs.bind(this);
	}

	getFilesIPs(ip, port_number, limit=3, offset=0) {
		this.context.store.dispatch(requestFilesIP(ip, port_number, limit, offset));
	}

	commentSubmitted(comment, _id) {
		this.context.store.dispatch(requestUpdateIPComment(this.props.project_uuid, _id, comment));
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

IPVerbose.contextTypes = {
    store: PropTypes.object
}

export default IPVerbose;