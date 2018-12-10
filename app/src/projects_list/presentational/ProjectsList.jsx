import _  from 'lodash'
import React from 'react'
import { Table, Input, Button, Icon } from 'semantic-ui-react'

import ProjectsListLine from "./ProjectsListLine.jsx"


class ProjectsList extends React.Component
{

    constructor(props) {
        super(props);

        this.state = {
            "new_project_name": ""
        }
    }

    render() {
        const projectsLines = _.map(this.props.projects, (x) => {
            return <ProjectsListLine project={x} 
                                     key={x.project_uuid} 
                                     onDelete={this.props.onDelete}/>
        });

        projectsLines.push(
            <Table.Row key="add_new_project">
                <Table.Cell></Table.Cell>
                <Table.Cell>
                    <Input
                        value={this.state.new_project_name}
                        onChange={(e) => this.setState({
                            "new_project_name" : e.target.value
                        })}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Button
                        icon
                        onClick={() => {
                            this.props.submitNewProject(this.state.new_project_name);
                            this.setState({
                                "new_project_name": ""
                            });
                        }}
                    >
                        <Icon name='plus' />
                    </Button>
                </Table.Cell>
            </Table.Row>
        );

        return (
            <div>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
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
