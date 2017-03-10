import React from 'react';
import Link from 'react-router-dom'

import ProjectActions from './ProjectActions.js';

class Project extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            projectName : props["projectName"] || null, 
            scope: props["scope"],
            uuid: props["uuid"]
        };

        this.delete = this.delete.bind(this);
    }

    delete(e) {
        e.preventDefault();
        ProjectActions.delete(this.state.uuid);
    }

    render() {
        var link = <Link to={"/project/" + this.state.projectName}>Details</Link>;

        return (
            <tr>
                <td>{this.state.uuid}</td>
                <td>{this.state.projectName}</td>
                <td>{this.state.scope}</td>
                <td>
                    {link}
                   <button onClick={this.delete}>Delete</button>
                </td>
            </tr>
        );
    }

}

export default Project;