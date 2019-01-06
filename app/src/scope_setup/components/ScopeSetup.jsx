import React from 'react'

import ScopeAdderTracked from '../../common/scope_adder/components/ScopeAdderTracked.jsx'
import HeadButtonsTracked from './HeadButtonsTracked.jsx'

import ProjectComment from '../../common/project_comment/ProjectComment.jsx'

import Stats from '../presentational/Stats.jsx'
import { Segment } from 'semantic-ui-react'

class ScopeSetup extends React.Component {

	constructor(props) {
		super(props);

		this.deleteScope = this.deleteScope.bind(this);
	}

	componentDidMount() {
		console.log(123);
	}

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(nextProps, this.props);
	}

	deleteScope(scope_id) {
		this.scopesEmitter.requestDeleteScope(scope_id, this.props.project_uuid);
	}

	render() {
		let { project, ips, hosts, scans, files, scopes } = this.props;

		return (
			<div>
				<ProjectComment project={project}/>
			</div>
		)
	}
}

export default ScopeSetup;
