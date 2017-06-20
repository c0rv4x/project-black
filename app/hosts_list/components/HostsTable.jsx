import _ from 'lodash'
import React from 'react'
import { Table, Button } from 'react-bootstrap'

import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'
import HostsEntryLine from '../presentational/HostsEntryLine.jsx'


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
								   project={this.props.project}
								   scope={x} 
								   onCommentSubmit={(event) => this.commentSubmitted(event.target.value, x._id)}
								   deleteScope={() => this.props.deleteScope(x._id)}

								   scans={_.filter(this.props.scans, (y) => {
								   	return x.ip_addresses.indexOf(y.target) !== -1;
								   })}/>
		});

		return (
			<div>
<<<<<<< Updated upstream
=======
				<Search onFilterChange={this.props.onFilterChange} />
				<br />
>>>>>>> Stashed changes
				{scopes}
			</div>
		)
	}

}

export default HostsTable;
