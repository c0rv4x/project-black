import _ from 'lodash';
import Reflux from 'reflux';

import ScopeActions from './ScopeActions.js';
import ScopeManager from '../common/ScopeManager.js';


class ScopeStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            "scopes" : [],
            "loading": false,
            "errorMessage": null
        };

        // Create scope manage
        this.scopeManager = new ScopeManager();

        // Obtain the data and redraw the table
        this.scopeManager.initialize(this.initializeScopes.bind(this));

        this.listenables = ScopeActions;
    }

    initializeScopes(scopes) {
        console.log(scopes);
        this.loading("", false);

        this.setState({
            scopes: scopes
        });
        this.trigger(this.state);
    }

    loading(errorMessage, status) {
        // Make a mark that loading status = 'status'
        this.setState({
            errorMessage: errorMessage, 
            loading: status
        });

        this.trigger(this.state);        
    }

    onCreate(newScope, projectName)
    {
        this.loading("", true);

        this.scopeManager.createScope(newScope, projectName, (result) => {
            if (result['status'] == 'success') {
                this.setState({
                    scopes: this.scopeManager.getScopes()
                });

                this.loading("", false);
            }
            else {
                this.loading(result['text'], false);                
            }
        });
    }

    onDelete(scopeID)
    {
        this.loading("", true);

        this.scopeManager.deleteScope(scopeID, (result) => {
            if (result['status'] == 'success') {
                this.setState({
                    scopes: this.scopeManager.getScopes()
                });

                this.loading("", false);
            }
            else {
                this.loading(result['text'], false);
            }
         
        });        
    }
}

export default ScopeStore