import React from 'react'

import ScopeAdderTracked from './scope_adder/components/ScopeAdderTracked.jsx'
import HeadButtonsTracked from './HeadButtonsTracked.jsx'

import ProjectComment from './project_comment/ProjectComment.jsx'

import Stats from '../presentational/Stats.jsx'

class ScopeSetup extends React.Component {
	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	render() {
		let { project, ips, hosts, scans, files, scopes } = this.props;

		return (
			<div>
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

				<ProjectComment project={project} />

				<ScopeAdderTracked
					project={project}
					scopesCreated={scopes.scopes_created}
				/>


			</div>
		)
	}
}

export default ScopeSetup;
