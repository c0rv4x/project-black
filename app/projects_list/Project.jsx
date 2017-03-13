import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import ProjectActions from './ProjectActions.js';

class Project extends React.Component {

    constructor(props) {
        super(props);

        const project = props['project'];

        this.delete = this.delete.bind(this);
    }

    delete(e) {
        e.preventDefault();
        ProjectActions.delete(this.props.project['project_uuid']);
    }

    render() {
        return (
            <tr>
                <td>{this.props.project['project_uuid']}</td>
                <td>{this.props.project['project_name']}</td>
                <td>
                    <Link to={"/project/" + this.props.project['project_name']}>
                        <Button bsStyle="default">Details</Button>
                    </Link>
                    <Button bsStyle="danger" onClick={this.delete}>Delete</Button>
                </td>
            </tr>
        );
    }

}

export default Project;
