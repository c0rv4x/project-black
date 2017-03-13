import Connector from '../common/SocketConnector.jsx';

class ScopeClass
{

    constructor(hostname, ip_address, scope_id, project_name)
    {
        this.hostname = hostname;
        this.ip_address = ip_address;
        this.scope_id = scope_id;
        this.project_name = project_name;
    }

}

let instance = null;

class ScopeManager 
{

    constructor() {
        if(!instance){
            instance = this;
            this.connector = new Connector();

            this.scopes = [];
        }

        return instance;
    }

    initialize(callback) {
        // Upon connecting to the server, request the data
        this.connector.after_connected(() => {
            this.connector.emit('scopes:all:get');
            this.connector.listen('scopes:all:get:back', (scopes) => {
            console.log('back');
                // After we got the scopes, add them and callback the result
                scopes = JSON.parse(scopes);

                // Empty all known scopes
                this.scopes = [];
                for (var scope of scopes) {
                    // Create a new scope
                    var new_scope = new ScopeClass(scope["hostname"], scope["ip_address"], scope["scope_id"], scope["project_name"]);
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

        this.connector.listen('scopes:create:' + project_name, (msg) => {
            var parsed_msg = JSON.parse(msg);

            if (parsed_msg['status'] == 'success') {
                var new_scopes = parsed_msg['new_scopes'];

                for (var scope of new_scopes) {
                    var new_scope = new ScopeClass(
                        scope["hostname"], 
                        scope["ip_address"],
                        scope["scope_id"], 
                        project_name);
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
    deleteScope(scope_id, callback) {
        this.connector.emit('scopes:delete:scope_id', scope_id);
        this.connector.listen('scopes:delete:scope_id:' + scope_id, (msg) => {
            var parsed_msg = JSON.parse(msg);

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
