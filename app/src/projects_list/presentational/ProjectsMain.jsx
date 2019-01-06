import _  from 'lodash'
import React from 'react'
import { Heading } from 'grommet'


import ProjectsList from "../presentational/ProjectsList.jsx"


class ProjectsMain extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <br />
                <Heading level={2}>Projects</Heading>
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
