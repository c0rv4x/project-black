import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

import ProjectStore from '../projects_list/ProjectStore.js';
import ProjectActions from '../projects_list/ProjectActions.js';


function getItemByKey(list,itemKey){
    return _.find(list, function(item) {
        return item.key === itemKey;
    });
}

class ProjectComment extends Reflux.Component
{

	constructor(props) {
		super(props);

		this.state = {
			"comment": props['comment']
		}

        this.store = ProjectStore;

        this.project_uuid = null;
		this.project_name = props['project_name'];

		this.commit = this.commit.bind(this);
		this.handleCommentChange = this.handleCommentChange.bind(this);
	}

	commit(e) {
		e.preventDefault();

		ProjectActions.commit(this.project_uuid, this.project_name, this.state.comment);
	}

    handleCommentChange(event) 
    {
        this.setState({comment: event.target.value});
    }

	render() {
		// Find a project's uuid by its name
		return (
			<div>
				<FormGroup controlId="formControlsTextarea">
					<ControlLabel>Description</ControlLabel>
					<FormControl componentClass="textarea" 
								 placeholder="Enter any comment you want" 
								 value={this.state.comment}
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
