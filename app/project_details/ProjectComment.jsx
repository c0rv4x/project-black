import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'

import ProjectStore from '../projects_list/ProjectStore.js';


class ProjectComment extends Reflux.Component
{

	constructor(props) {
		super(props);

		this.state = {
			"comment": ""
		}

        this.store = ProjectStore;

		this.project_name = props['project_name'];

		this.commit = this.commit.bind(this);
		this.handleCommentChange = this.handleCommentChange.bind(this);
	}

	commit() {

	}

    handleCommentChange(event) 
    {
        this.setState({comment: event.target.value});
    }

	render() {
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
		        <br/>
	        </div>
		)
	}

}

export default ProjectComment;
