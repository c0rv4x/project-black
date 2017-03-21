import React from 'react'

import ProjectComment from './ProjectComment.jsx';
import ProjectScope from './ProjectScope.jsx';
import Tasks from './Tasks.jsx';

import { Button, DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

class ProjectDetailsPage extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h2>Project project_name<span>  </span>
					<DropdownButton bsStyle="default" title="Start Task" id="dropdown-basic">
						<MenuItem eventKey="1" onClick={this.props.runMasscan}>Masscan</MenuItem>
					</DropdownButton>

					<Button onClick={() => this.props.resolveScopes(null, this.props.project.project_uuid)}>
						Resolve Scopes
					</Button>
				</h2>
				<hr />
				<Tasks tasks={this.props.tasks} />
				<ProjectComment commentInput={this.props.commentInput}
								onCommentInputChange={this.props.onCommentInputChange}
								commentSubmitted={this.props.commentSubmitted} 

								project={this.props.project}/>
				<hr />
				<ProjectScope newScopeInput={this.props.newScopeInput}
							  handleNewScopeChange={this.props.handleNewScopeChange}
							  onNewScopeClick={this.props.onNewScopeClick} 

							  deleteScope={this.props.deleteScope}
							  scopes={this.props.scopes} />
			</div>
		)
	}

}


export default ProjectDetailsPage;