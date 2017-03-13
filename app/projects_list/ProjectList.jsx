import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import { Button, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap'

import Project from './Project.jsx';
import ProjectStore from './ProjectStore.js';
import ProjectActions from './ProjectActions.js';


class ProjectList extends Reflux.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            'newProject': {
                'name': ""
            }
        };
        this.store = ProjectStore;

        this.create = this.create.bind(this);

        this.handleNewProjectNameChange = this.handleNewProjectNameChange.bind(this);
    }

    create(e)
    {
        e.preventDefault();
        ProjectActions.create(this.state.newProject.name);        
    }

    handleNewProjectNameChange(event) 
    {
        var project = this.state.newProject;
        project['name'] = event.target.value;
        this.setState({newProject: project});
    }    

    render()
    {
        var projects = _.map(this.state.projects, (x) => {
            return <Project project={x} key={x.project_uuid} />
        });

        return (
            <div>
                {this.state.loading && 
                    <div>Loading...</div>
                }
                {this.state.errorMessage && 
                    <div>{this.state.errorMessage}</div>
                }

                <h2>Projects</h2>
                <form>
                    <FormGroup>
                        <ControlLabel>Create new project or select the existing</ControlLabel>

                        <FormControl placeholder="Project Name"
                                     type="text"
                                     value={this.state.newProject.name}
                                     onChange={this.handleNewProjectNameChange}/>
                    </FormGroup>
                </form>

                <Button bsStyle="primary" onClick={this.create}>Add new</Button>

                <hr />
                <h2>Your projects:</h2>

                <Table bordered>
                    <thead>
                        <tr>
                            <td>UUID</td>
                            <td>Project Name</td>
                            <td>Control</td>
                        </tr>
                    </thead>
                    <tbody>
                        {projects}
                    </tbody>
                </Table>
            </div>
        );
    }

}

export default ProjectList;
