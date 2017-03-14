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
        this.scopeManager.initialize(this.updateScopes.bind(this));

        this.listenables = ScopeActions;
    }

    updateScopes(result) {
        if (result['status'] == 'success') {
            this.setState({
                scopes: result['scopes']
            });

            this.loading("", false);
        }
        else {
            this.loading(result['text'], false);
        }
    }

    loading(errorMessage, status) {
        // Make a mark that loading status = 'status'
        this.setState({
            errorMessage: errorMessage, 
            loading: status
        });

        this.trigger(this.state);        
    }

    onCreate(new_scopes, project_uuid)
    {
        if (new_scopes['status'] == 'success') {            
            this.loading("", true);

            this.scopeManager.createScope(new_scopes['prepared_targets'], project_uuid, (result) => {
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
        else {
            this.loading(new_scopes['text'], false);
        }
    }

    onDelete(scope_id, project_uuid)
    {
        this.loading("", true);

        this.scopeManager.deleteScope(scope_id, project_uuid);        
    }

}

export default ScopeStore
