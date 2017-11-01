import React from 'react'
import { Table } from 'react-bootstrap'

import ScopeAdderTracked from '../../ips_list/components/ScopeAdderTracked.jsx'
import HeadButtonsTracked from './HeadButtonsTracked.jsx'
import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'

import Tasks from '../../common/tasks/Tasks.jsx'
import IPTable from '../presentational/IPTable.jsx'
import HostTable from '../presentational/HostTable.jsx'
import ProjectComment from '../../common/project_comment/ProjectComment.jsx'


class ScopeSetup extends React.Component {
	constructor(props) {
		super(props);

		this.scopesEmitter = new ScopesSocketioEventsEmitter();		

		this.deleteScope = this.deleteScope.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !_.isEqual(nextProps, this.props);
	}

	deleteScope(scope_id) {
		this.scopesEmitter.requestDeleteScope(scope_id, this.props.project_uuid);
	}

	render() {
		return (
			<div>
				<br/>
				<HeadButtonsTracked project={this.props.project}
									hosts={this.props.scopes.hosts} />

				<ScopeAdderTracked project={this.props.project} />

				<ProjectComment project={this.props.project}/>

				<IPTable ips={this.props.scopes.ips}
						 delete={this.deleteScope} />

				<HostTable hosts={this.props.scopes.hosts}
						   delete={this.deleteScope} />

			</div>
		)
	}
}

export default ScopeSetup;
