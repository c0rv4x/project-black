import React from 'react'
import { 
	Table 
} from 'react-bootstrap';

import ScopeAdder from './ScopeAdder.jsx'
import ScopeTable from './ScopeTable.jsx'


class ProjectScope extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<ScopeAdder newScopeInput={this.props.newScopeInput}
							handleNewScopeChange={this.props.handleNewScopeChange}
							onNewScopeClick={this.props.onNewScopeClick} />
				<ScopeTable scopes={this.props.scopes}
							deleteScope={this.props.deleteScope}

							scans={this.props.scans}/>
			</div>
		)
	}

}


export default ProjectScope;