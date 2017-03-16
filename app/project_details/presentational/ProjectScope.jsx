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
				<ScopeAdder />
				<ScopeTable />
			</div>
		)
	}

}


export default ProjectScope;