import React from 'react';

import ScopeActions from './ScopeActions.js';

class ScopeTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            projectName : props["projectName"] || null, 
            hostname : props["hostname"] || null,
            IP : props["IP"] || null,
            scopeID : props["scopeID"] || null
        };

        this.delete = this.delete.bind(this);
    }

    delete(e) {
        e.preventDefault();
        ScopeActions.delete(this.state.scopeID);
    }

    render() {
        return (
            <tr>
                <td>{this.state.scopeID}</td>
                <td>{this.state.hostname}</td>
                <td>{this.state.IP}</td>
                <td>{this.state.projectName}</td>
                <td>
                    <button onClick={this.delete}>Delete</button>
                </td>
            </tr>
        );
    }

}

export default ScopeTable;