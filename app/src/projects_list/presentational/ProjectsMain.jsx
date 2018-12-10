import _  from 'lodash'
import React from 'react'
import { Divider, Header } from 'semantic-ui-react'

import ProjectsList from "../presentational/ProjectsList.jsx"


class ProjectsMain extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Divider hidden />
                <Header as="h2">Projects</Header>
                <ProjectsList
                    projects={this.props.projects}
                    onDelete={this.props.onDelete}
                    submitNewProject={this.props.submitNewProject}
                />
            </div>
        )
    }

}

export default ProjectsMain;
