import _  from 'lodash'
import React from 'react'
import { Table } from 'react-bootstrap'

import ProjectsListLine from "./ProjectsListLine.jsx"


class ProjectsList extends React.Component
{

    constructor(props) {
        super(props);
    }

    render() {
        const projectsLines = _.map(this.props.projects, (x) => {
            return <ProjectsListLine project={x} 
                                     key={x.project_uuid} 
                                     onDelete={this.props.onDelete}/>
        })

        return (
            <div>
                <hr />
                <h2>Your projects:</h2>

                <Table bordered>
                    <thead>
                        <tr>
                            <td>UUID</td>
                            <td>Project Name</td>
                            <td>Control</td>
                        </tr>
                    </thead>
                    <tbody>
                        {projectsLines}
                    </tbody>
                </Table>
            </div>
        )
    }

}

export default ProjectsList;