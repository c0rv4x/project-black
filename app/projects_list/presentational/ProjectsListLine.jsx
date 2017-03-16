import _  from 'lodash';
import React from 'react';


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
                <td>{this.delete}</td>
            </tr>
        )
    }

}

export default ProjectsListLine;