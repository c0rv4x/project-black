import React from 'react';


import Project from './Project.jsx';

class ProjectList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {projects : [
            <Project uuid="uuid_1" projectName="1" key="uuid_1"/>, 
            <Project uuid="uuid_2" projectName="2" key="uuid_2"/>
        ]};
    }

    render() {
        return (
            <div>
                <h2>ProjectList</h2>

                <table>
                    <thead>
                        <tr><td>Project Name</td></tr>
                        <tr><td>Scope</td></tr>
                    </thead>
                    <tbody>
                        {this.state.projects}
                    </tbody>
                </table>

            </div>
        );
    }

}

export default ProjectList;