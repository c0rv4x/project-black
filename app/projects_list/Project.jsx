import React from 'react';

class Project extends React.Component {

    constructor(props) {
        super(props);

        var projectName = props["projectName"] || null;
        this.state = {projectName : projectName};
    }

    render() {
        return (
            <tr>
                <td>{this.state.projectName}</td>
                <td>Some scope</td>
            </tr>
        );
    }

}

export default Project;