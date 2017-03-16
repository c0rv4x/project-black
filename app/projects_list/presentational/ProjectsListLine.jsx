import _  from 'lodash';
import React from 'react';
import { Button } from 'react-bootstrap';


class ProjectsListLine extends React.Component
{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.project.project_uuid}</td>
                <td>{this.props.project.project_name}</td>
                <td>
                    <Button bsStyle="danger" onClick={() => this.props.onDelete(this.props.project.project_uuid)}>Delete</Button>
                    </td>
            </tr>
        )
    }

}

export default ProjectsListLine;