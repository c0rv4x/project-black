import _  from 'lodash';
import React from 'react';
import Reflux from 'reflux';

import ScopeStore from './ScopeStore.js';
import ScopeActions from './ScopeActions.js';


function findScopeType(target) {
    function tryIPNetwork(target) {
        return target.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\/[0-9]{1,2}$/);
    }

    function tryIPAddress(target) {
        return target.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/);
    }

    function tryHostname(target) {
        return target.match(/^([a-zA-Z]{1}[a-zA-Z0-9\-]{0,255}\.){1,}[a-zA-Z]{2,15}$/);
    }

    if (tryIPNetwork(target)) {
        return "network";
    }
    else if (tryIPAddress(target)) {
        return "IP";
    }
    else if (tryHostname(target)) {
        return "hostname";
    }
    else {
        return "error";
    }
}


class ScopeList extends Reflux.Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            'newScope': {
                'targets': ""
            },
            'errorMessage': ""
        };
        this.store = ScopeStore;

        this.create = this.create.bind(this);

        this.handleNewScopeChange = this.handleNewScopeChange.bind(this);
    }

    create(e)
    {
        e.preventDefault();

        var errorMsg = "";

        var newTargets = this.state.newScope['targets'].split(',');
        var niceTargets = _.map(newTargets, _.trim);

        var preparedTargets = [];

        for (var target of niceTargets) {
            var targetType = findScopeType(target);

            if (targetType == 'error') {
                if (!errorMsg) {
                    errorMsg += "Please use IP, CIDR, hostnames divided with comma. This is bad: " + target;
                }
                else {
                    errorMsg += ", " + target;
                }
            }
            else {
                preparedTargets.push({
                    'type': targetType,
                    'target': target
                });
            }
        }

        if (errorMsg) {
            this.setState({
                errorMessage: errorMsg
            });

            // this.trigger(this.state);              
        }
        else {
            this.setState({
                errorMessage: 'ok'
            });

            ScopeActions.create(preparedTargets, this.props.projectName);        

            // this.trigger(this.state);              
        }
    }

    handleNewScopeChange(event) 
    {
        var scope = this.state.newScope;
        scope['targets'] = event.target.value;
        this.setState({newScope: scope});
    }

    render()
    {

        return (
            <div>
                {this.state.errorMessage && 
                    <div>{this.state.errorMessage}</div>
                }
                
                <input 
                    id="scope" 
                    placeholder="scope" 
                    value={this.state.newScope.targets}
                    onChange={this.handleNewScopeChange} />                    
                <button onClick={this.create}>Add new</button>

            </div>
        );
    }

}

export default ScopeList;