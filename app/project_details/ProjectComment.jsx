import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

// import ProjectStore from '../projects_list/ProjectStore.js';
import ProjectActions from '../projects_list/ProjectActions.js';


class ProjectComment extends Reflux.Component
{

	constructor(props) {
		super(props);

		this.project = props['project'];
        this.project_uuid = this.project['project_uuid'];
		this.project_name = this.project['project_name'];
		this.comment = this.project['comment'];
        // this.store = ProjectStore;

		this.commit = this.commit.bind(this);
		this.handleCommentChange = this.handleCommentChange.bind(this);
	}

	handleCommentChange(e) {
		this.props.onCommentEdit(e.target.value);
	}

	commit(e) {
		e.preventDefault();
		ProjectActions.commit(this.project_uuid, this.project_name, this.comment);
	}

	render() {
		this.comment = this.props.project.comment;

		return (
			<div>
				<FormGroup controlId="formControlsTextarea">
					<ControlLabel>Description</ControlLabel>
					<FormControl componentClass="textarea" 
								 placeholder="Enter any comment you want" 
								 value={this.comment}
								 onChange={this.handleCommentChange} />
				</FormGroup>			
	            <Button bsStyle="primary" onClick={this.commit}>Commit comment</Button>
		        <br/>
		        <br/>
	        </div>
		)
	}

}

export default ProjectComment;
