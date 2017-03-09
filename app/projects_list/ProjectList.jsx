import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';

import Project from './Project.jsx';
import ProjectStore from './ProjectStore.js';


// module.exports = React.createClass({
class ProjectList extends React.Component {

    constructor(props) {
        super(props)

        console.log(this.state);
        this.state = {};
        this.state['projects'] = [<Project projectName="project_1" uuid="uuid_1" key="uuid_1" />];
        this.state['projectsStore'] = Reflux.connect(ProjectStore, 'projectsStore');
    }


    render() {
        console.log(this.state);
        var store = this.state.projectsStore;

        if (store.loading) {
            return <div className='alert alert-info'>Loading...</div>;
        }

        if (store.errorMessage) {
            return <div className='alert alert-danger'>{store.errorMessage}</div>;
        }

        var projects = this.state.projects;

        return (
            <table>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Scope</th>
                    </tr>
                </thead>
                <tbody>
                    {projects}
                </tbody>
            </table>
        );
    }
};

export default ProjectList;
