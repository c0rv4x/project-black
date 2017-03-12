import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';

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
            return <Project projectName={x.projectName} uuid={x.uuid} key={x.uuid} />
        });

        return (
            <div>
                {this.state.loading && 
                    <div>Loading...</div>
                }
                {this.state.errorMessage && 
                    <div>{this.state.errorMessage}</div>
                }
                
                <input 
                    id="projectName" 
                    placeholder="projectName" 
                    value={this.state.newProject.name}
                    onChange={this.handleNewProjectNameChange} />

                <button onClick={this.create}>Add new</button>

                <br />
                <br />
                <br />

                <table>
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
                </table>
            </div>
        );
    }

}

export default ProjectList;