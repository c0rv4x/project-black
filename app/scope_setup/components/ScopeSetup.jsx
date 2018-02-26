import React from 'react'
import { Table } from 'react-bootstrap'

import ScopeAdderTracked from '../../ips_list/components/ScopeAdderTracked.jsx'
import HeadButtonsTracked from './HeadButtonsTracked.jsx'
import ScopesSocketioEventsEmitter from '../../redux/scopes/ScopesSocketioEventsEmitter.js'

import Tasks from '../../common/tasks/Tasks.jsx'
import ProjectComment from '../../common/project_comment/ProjectComment.jsx'

import Stats from '../presentational/Stats.jsx'


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
		let { project, ips, hosts, scans } = this.props;

		return (
			<div>
				<br/>
				<ProjectComment project={project}/>
				<HeadButtonsTracked project={project}
									hosts={hosts} />

				<ScopeAdderTracked project={project} />

				<Stats
					ips={ips}
					hosts={hosts}
					scans={scans}
				/>

			</div>
		)
	}
}

export default ScopeSetup;
