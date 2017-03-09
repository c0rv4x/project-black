import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';

import Project from './Project.jsx';
import ProjectStore from './ProjectStore.js';

class ProjectList extends Reflux.Component
{

    constructor(props)
    {
        super(props);
        this.state = {};
        this.store = ProjectStore;
    }

    render()
    {
        var projects = _.map(this.state.projects, (x) => {
            return <Project projectName={x.projectName} uuid={x.uuid} key={x.uuid} />
        });

        return (
            <table>
                <thead>
                    <tr>
                        <td>UUID</td>
                        <td>Project Name</td>
                        <td>Scope</td>
                        <td>Control</td>
                    </tr>
                </thead>
                <tbody>
                    {projects}
                </tbody>
            </table>
        );
    }

}

export default ProjectList;