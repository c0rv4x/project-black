import Connector from '../common/SocketConnector.jsx';

class ScopeClass
{

    constructor(scope)
    {
        this.scope = scope;
        this.hostname = scope.hostname;
        this.ip_address = scope.ip_address;
        this.scope_id = scope.scope_id;
        this.project_uuid = scope.project_uuid;
    }

}

let instance = null;

class ScopeManager 
{

    constructor() {
        if(!instance){
            instance = this;
            this.connector = new Connector();

            this.registered_project_uuids = [];

            this.scopes = [];

            this.callback = [];
        }

        return instance;
    }

    initialize(callback) {
        this.callback = callback;

        // Upon connecting to the server, request the data
        this.connector.after_connected(() => {
            this.connector.emit('scopes:all:get');
            this.register_scopes_new(callback);

            this.connector.emit('projects:all:get');
            this.connector.listen('projects:all:get:back', (projects) => {
                var parsedMsg = JSON.parse(projects);

                _.map(parsedMsg, (x) => {
                    this.register_scopes_creation_deleting(x['project_uuid'], callback);
                });
            });
            this.connector.listen('projects:create', (msg) => {
                const parsedMsg = JSON.parse(msg);

                this.register_scopes_creation_deleting(parsedMsg['new_project']['project_uuid'], callback);
            });

        });        
    }

    register_scopes_new(callback) {
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
            callback({
                'status': 'success',
                'scopes': this.getScopes()
            });
        });         
    }

    register_scopes_creation_deleting(project_uuid, callback) {
        if (this.registered_project_uuids.indexOf(project_uuid) === -1) {
            this.register_scopes_new_single(project_uuid, callback);
            this.register_scopes_delete(project_uuid, callback);
        }
    }

    register_scopes_new_single(project_uuid, callback) {
        this.registered_project_uuids.push(project_uuid);

        this.connector.listen('scopes:create:' + project_uuid, (msg) => {
            var parsed_msg = JSON.parse(msg);

            if (parsed_msg['status'] == 'success') {
                var new_scopes = parsed_msg['new_scopes'];

                for (var scope of new_scopes) {
                    scope["project_uuid"] = project_uuid;

                    var new_scope = new ScopeClass(scope);
                    this.scopes.push(new_scope);
                }

                // OK
                callback({
                    'status': 'success',
                    'scopes': this.getScopes()
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

    register_scopes_delete(project_uuid, callback) {
        this.connector.listen('scopes:delete:' + project_uuid, (msg) => {
            var parsed_msg = JSON.parse(msg);

            if (parsed_msg['status'] == 'success') {
                this.scopes = _.filter(this.scopes, (x) => {
                    return ((x['project_uuid'] == project_uuid) && (x['scope_id'] != parsed_msg['scope_id']));
                });

                callback({
                    'status': 'success',
                    'scopes': this.getScopes()
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

    getScopes() {
        return this.scopes;
    }

    createScope(scopes, project_uuid, callback) {
        this.connector.emit('scopes:create', {
            project_uuid: project_uuid,
            scopes: scopes
        });
    }

    deleteScope(scope_id, project_uuid, callback) {
        this.connector.emit('scopes:delete:scope_id', {
            scope_id: scope_id,
            project_uuid: project_uuid
        });
    }

}

export default ScopeManager;
