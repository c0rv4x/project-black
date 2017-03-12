import Connector from '../common/SocketConnector.jsx';

class ScopeClass
{

    constructor(hostname, IP, scopeID, projectName)
    {
        this.hostname = hostname;
        this.IP = IP;
        this.scopeID = scopeID;
        this.projectName = projectName;
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
                    var newScope = new ScopeClass(scope["hostname"], scope["IP"], scope["scopeID"], scope["projectName"]);
                    this.scopes.push(newScope);
                }

                // Callback everything, we just saved
                callback(this.getScopes());
            });            
        });        
    }

    getScopes() {
        return this.scopes;
    }

    deleteScope(scopeID, callback) {
        this.connector.emit('scopes:delete:scopeID', scopeID);
        this.connector.listen('scopes:delete:scopeID:' + scopeID, (msg) => {
            var parsedMsg = JSON.parse(msg);

            if (parsedMsg['status'] == 'success') {
                this.scopes = _.filter(this.scopes, (x) => {
                    return x['scopeID'] != scopeID;
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