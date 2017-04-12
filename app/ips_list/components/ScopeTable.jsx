import _ from 'lodash'
import React from 'react'
import { Table, Button } from 'react-bootstrap'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import ScopeEntryLine from '../presentational/scope/ScopeEntryLine.jsx'


class ScopeTable extends React.Component {

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
			return <ScopeEntryLine key={x._id} 
								   scope={x} 
								   onCommentChange={(e) => this.props.onCommentChange(e.target.value, x._id)}
								   onCommentSubmit={() => this.commentSubmitted(x.comment, x._id)}
								   deleteScope={() => this.props.deleteScope(x._id)}

								   scans={_.filter(this.props.scans, (y) => {
								   	return y.target == x.ip_address;
								   })}/>
		});

		return (
			<div>
				{scopes}
			</div>
		)
	}

}

export default ScopeTable;
