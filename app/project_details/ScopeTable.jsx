import React from 'react';

import ScopeActions from './ScopeActions.js';

class ScopeTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            project_name : props["project_name"] || null, 
            hostname : props["hostname"] || null,
            ip_address : props["ip_address"] || null,
            scope_id : props["scope_id"] || null
        };

        this.delete = this.delete.bind(this);
    }

    delete(e) {
        e.preventDefault();
        ScopeActions.delete(this.state.scope_id);
    }

    render() {
        return (
            <tr>
                <td>{this.state.scope_id}</td>
                <td>{this.state.hostname}</td>
                <td>{this.state.ip_address}</td>
                <td>{this.state.project_name}</td>
                <td>
                    <button onClick={this.delete}>Delete</button>
                </td>
            </tr>
        );
    }

}

export default ScopeTable;
