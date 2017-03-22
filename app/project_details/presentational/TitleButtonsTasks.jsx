import React from 'react'
import { Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';


class TitleButtonsTasks extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<h2>Project project_name<span>  </span>
				<DropdownButton bsStyle="default" title="Start Task" id="dropdown-basic">
					<MenuItem eventKey="1" onClick={this.props.runMasscan}>Masscan</MenuItem>
					<MenuItem eventKey="2" onClick={this.props.runNmap}>Nmap</MenuItem>
					<MenuItem eventKey="3" onClick={this.props.runNmapOnlyOpen}>Nmap banner edition</MenuItem>
				</DropdownButton>

				<Button onClick={() => this.props.resolveScopes(null, this.props.project.project_uuid)}>
					Resolve Scopes
				</Button>
			</h2>
		)
	}

}

export default TitleButtonsTasks;