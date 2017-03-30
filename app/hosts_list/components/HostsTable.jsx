import _ from 'lodash';
import React from 'react';
import { Table, Button } from 'react-bootstrap';

import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';
import HostsEntryLine from '../presentational/HostsEntryLine.jsx';


class HostsTable extends React.Component {

	constructor(props) {
		super(props);
		this.scopesEmitter = new ScopesSocketioEventsEmitter();

		this.commentSubmitted = this.commentSubmitted.bind(this);
	}

	commentSubmitted(comment, _id) {
		this.scopesEmitter.requestUpdateScope(comment, _id);
	}

	render() {
		const scopes = _.map(this.props.scopes, (x) => {
			return <HostsEntryLine key={x._id} 
								   scope={x} 
								   onCommentChange={(e) => this.props.onCommentChange(e.target.value, x._id)}
								   onCommentSubmit={() => this.commentSubmitted(x.comment, x._id)}
								   deleteScope={() => this.props.deleteScope(x._id)}

								   scans={_.filter(this.props.scans, (y) => {
								   	return y.target in x.ip_addresses;
								   })}/>
		});

		return (
			<div>
				{scopes}
			</div>
		)
	}

}

export default HostsTable;