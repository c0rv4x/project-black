import React from 'react'

import ScopeAdderTracked from '../../ips_list/components/ScopeAdderTracked.jsx'
import HeadButtonsTracked from './HeadButtonsTracked.jsx'

import ProjectComment from '../../common/project_comment/ProjectComment.jsx'

import Stats from '../presentational/Stats.jsx'


class ScopeSetup extends React.Component {
	constructor(props) {
		super(props);

		this.deleteScope = this.deleteScope.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	deleteScope(scope_id) {
		this.scopesEmitter.requestDeleteScope(scope_id, this.props.project_uuid);
	}

	render() {
		let { project, ips, hosts, scans, files, scopes } = this.props;
		let scopes_created = null; // TODO!

		return (
			<div>
				<br/>
				<ProjectComment project={project}/>
				<HeadButtonsTracked
					project={project}
					hosts={hosts}
				/>

				<ScopeAdderTracked
					project={project}
					scopesCreated={scopes.scopes_created}
				/>

				<Stats
					ips={ips}
					hosts={hosts}
					scans={scans}
					files={files}
				/>

			</div>
		)
	}
}

export default ScopeSetup;
