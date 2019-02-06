import React from 'react'

import ScopeAdderTracked from '../../common/scope_adder/components/ScopeAdderTracked.jsx'
import HeadButtonsTracked from './HeadButtonsTracked.jsx'

import ProjectComment from '../../common/project_comment/ProjectComment.jsx'

import Stats from '../presentational/Stats.jsx'

class ScopeSetup extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	render() {
		let { project, ips, hosts, scans, files, scopes } = this.props;

		return (
			<div>
				<ProjectComment project={project} />
				<br />

				<HeadButtonsTracked
					project={project}
					hosts={hosts}
				/>

				<Stats
					ips={ips}
					hosts={hosts}
					scans={scans}
					files={files}
					project={project}
				/>

				<br />
				<ScopeAdderTracked
					project={project}
					scopesCreated={scopes.scopes_created}
				/>
			</div>
		)
	}
}

export default ScopeSetup;
