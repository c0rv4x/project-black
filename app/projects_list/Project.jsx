import React from 'react';

class Project extends React.Component {

    constructor(props) {
        super(props);

        var projectName = props["projectName"] || null;
        this.state = {projectName : projectName};
    }

    render() {
        return (
            <div>
            Project Name = <span>{this.state.projectName}</span>
            </div>
        );
    }

}

export default Project;