import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import ProjectActions from './ProjectActions.js';

class Project extends React.Component {

    constructor(props) {
        super(props);

        const project = props['project'];

        this.state = {
            project: project
        };

        this.delete = this.delete.bind(this);
    }

    delete(e) {
        e.preventDefault();
        ProjectActions.delete(this.state.project['project_uuid']);
    }

    render() {
        var detailsLink = <Link to={"/project/" + this.state.project['project_name']}>Details</Link>;

        return (
            <tr>
                <td>{this.state.project['project_uuid']}</td>
                <td>{this.state.project['project_name'] + ' ' + this.state.project['comment']}</td>
                <td>
                    <Link to={{
                        pathname: "/project/" + this.state.project['project_name'],
                        state: { project: this.state.project }
                    }}>
                        <Button bsStyle="default">Details</Button>
                    </Link>
                    <Button bsStyle="danger" onClick={this.delete}>Delete</Button>
                </td>
            </tr>
        );
    }

}

export default Project;
