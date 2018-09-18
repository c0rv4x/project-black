import _  from 'lodash'
import React from 'react'
import { Table, Header } from 'semantic-ui-react'

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
                <Header as="h2">Your projects:</Header>

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>UUID</Table.HeaderCell>
                            <Table.HeaderCell>Project Name</Table.HeaderCell>
                            <Table.HeaderCell>Control</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {projectsLines}
                    </Table.Body>
                </Table>
            </div>
        )
    }

}

export default ProjectsList;
