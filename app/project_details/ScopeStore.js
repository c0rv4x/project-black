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
        console.log('recieved scopes');
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

    // bad
    onCreate(scopeName, scope)
    {
        this.loading("", true);

        this.scopeManager.createScope(scopeName, scope, (result) => {
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

    // bad
    onDelete(uuid)
    {
        this.loading("", true);

        this.scopeManager.deleteScope(uuid, (result) => {
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