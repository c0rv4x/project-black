import _ from 'lodash';
import React from 'react';
import { Table, Button } from 'react-bootstrap';

import ScopesSocketioEventsEmitter from '../../common/scopes/ScopesSocketioEventsEmitter.js';
import ScopeEntryLine from '../presentational/scope/ScopeEntryLine.jsx';


class ScopeTable extends React.Component {

	constructor(props) {
		super(props);

		this.scopesEmitter = new ScopesSocketioEventsEmitter();

		this.commentSubmitted = this.commentSubmitted.bind(this);
	}

	commentSubmitted(comment, scope_id) {
		this.scopesEmitter.requestUpdateScope(comment, scope_id);
	}

	render() {
		const scopes = _.map(this.props.scopes, (x) => {
			return <ScopeEntryLine key={x.scope_id} 
								   scope={x} 
								   onCommentChange={(e) => this.props.onCommentChange(e.target.value, x.scope_id)}
								   onCommentSubmit={() => this.commentSubmitted(x.comment, x.scope_id)}
								   deleteScope={() => this.props.deleteScope(x.scope_id)}

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