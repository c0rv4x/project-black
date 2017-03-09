import React from 'react';

import ProjectActions from './ProjectActions.js';

class Project extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            projectName : props["projectName"] || null, 
            uuid: props["uuid"]
        };

        this.delete = this.delete.bind(this);
    }

    delete(e) {
        e.preventDefault();
        ProjectActions.delete(this.state.uuid);
    }

    render() {
        return (
            <tr>
                <td>{this.state.uuid}</td>
                <td>{this.state.projectName}</td>
                <td>Some scope</td>
                <td><button onClick={this.delete}>Delete</button></td>
            </tr>
        );
    }

}

export default Project;