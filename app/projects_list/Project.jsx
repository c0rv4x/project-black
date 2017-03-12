import React from 'react';
import { Link } from 'react-router-dom'

import ProjectActions from './ProjectActions.js';

class Project extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            project_name : props["project_name"] || null, 
            uuid: props["uuid"]
        };

        this.delete = this.delete.bind(this);
    }

    delete(e) {
        e.preventDefault();
        ProjectActions.delete(this.state.uuid);
    }

    render() {
        var detailsLink = <Link to={"/project/" + this.state.project_name}>Details</Link>;

        return (
            <tr>
                <td>{this.state.uuid}</td>
                <td>{this.state.project_name}</td>
                <td>
                    <Link to={"/project/" + this.state.project_name}>Details</Link>
                    <button onClick={this.delete}>Delete</button>
                </td>
            </tr>
        );
    }

}

export default Project;
