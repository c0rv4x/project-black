import React from 'react';
import { Button } from 'react-bootstrap'

import ScopeActions from './ScopeActions.js';

class ScopeTable extends React.Component {

    constructor(props) {
        super(props);

        this.delete = this.delete.bind(this);
    }

    delete(e) {
        e.preventDefault();
        ScopeActions.delete(this.props['scope'].scope_id);
    }

    render() {
        return (
            <tr>
                <td>{this.props['scope'].scope_id}</td>
                <td>{this.props['scope'].hostname}</td>
                <td>{this.props['scope'].ip_address}</td>
                <td>{this.props['scope'].project_name}</td>
                <td>
                    <Button bsStyle="danger" onClick={this.delete}>Delete</Button>
                </td>
            </tr>
        );
    }

}

export default ScopeTable;
