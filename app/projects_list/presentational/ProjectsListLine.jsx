import _  from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from 'reactstrap'


class ProjectsListLine extends React.Component
{

    constructor(props) {
        super(props);
    }

    delete_project(project_uuid) {
        if (confirm("Are you sure you want to delete?")) {
            this.props.onDelete(project_uuid);
        }
    }

    render() {
        return (
            <tr>
                <td>{this.props.project.project_uuid}</td>
                <td>{this.props.project.project_name}</td>
                <td>
                    <Link to={"/project/" + this.props.project.project_uuid}>
                        <Button color="default">Details</Button>
                    </Link>
                    <Button color="danger" 
                            onClick={
                                () => {
                                    this.delete_project(this.props.project.project_uuid);
                                }
                            }>
                        Delete
                    </Button>
                    </td>
            </tr>
        )
    }

}

export default ProjectsListLine;
