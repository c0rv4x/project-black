import Connector from '../common/SocketConnector.jsx';

class ScopeClass
{

    constructor(scope)
    {
        this.scope = scope;
        this.hostname = scope.hostname;
        this.ip_address = scope.ip_address;
        this.scope_id = scope.scope_id;
        this.project_name = scope.project_name;
    }

}

let instance = null;

class ScopeManager 
{

    constructor() {
        if(!instance){
            instance = this;
            this.connector = new Connector();

            this.registered_project_names = [];

            this.scopes = [];
        }

        return instance;
    }

    initialize(callback) {
        // Upon connecting to the server, request the data
        this.connector.after_connected(() => {
            this.connector.emit('scopes:all:get');
            this.connector.listen('scopes:all:get:back', (scopes) => {
                // After we got the scopes, add them and callback the result
                scopes = JSON.parse(scopes);

                // Empty all known scopes
                this.scopes = [];
                for (var scope of scopes) {
                    // Create a new scope
                    var new_scope = new ScopeClass(scope);
                    this.scopes.push(new_scope);
                }

                // Callback everything, we just saved
                callback(this.getScopes());
            });            
        });        
    }

    getScopes() {
        return this.scopes;
    }

    createScope(scopes, project_name, callback) {
        this.connector.emit('scopes:create', {
            project_name: project_name,
            scopes: scopes
        });

        if (this.registered_project_names.indexOf(project_name) === -1) {
            this.registered_project_names.push(project_name);

            this.connector.listen('scopes:create:' + project_name, (msg) => {
                var parsed_msg = JSON.parse(msg);
                if (parsed_msg['status'] == 'success') {
                    var new_scopes = parsed_msg['new_scopes'];

                    for (var scope of new_scopes) {
                        scope["project_name"] = project_name;

                        var new_scope = new ScopeClass(scope);
                        this.scopes.push(new_scope);
                    }

                    // OK
                    callback({
                        'status': 'success'
                        // 'new_scopes': new_scopes
                    });
                }
                else {
                    // Err
                    callback({
                        'status': 'error',
                        'text': parsed_msg['text']
                    });                
                }
             
            });        
        }
        else {
            console.log('Already registered this scope');
        }

    }
    deleteScope(scope_id, callback) {
        this.connector.emit('scopes:delete:scope_id', scope_id);
        this.connector.listen('scopes:delete:scope_id:' + scope_id, (msg) => {
            var parsed_msg = JSON.parse(msg);
            console.log(this.connector);
            if (parsed_msg['status'] == 'success') {
                this.scopes = _.filter(this.scopes, (x) => {
                    return x['scope_id'] != scope_id;
                });

                callback({
                    'status': 'success'
                });
            }
            else {
                callback({
                    'status': 'error',
                    'text': msg['text']
                });                
            }
        });
    }

}

export default ScopeManager;
