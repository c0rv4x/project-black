import Connector from '../common/SocketConnector.jsx';

class ScopeClass
{

    constructor(hostname, IP, scopeID)
    {
        this.hostname = hostname;
        this.IP = IP;
        this.scopeID = scopeID;
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
        this.connector.listen('connect', () => {
            this.connector.emit('scopes:all:get');
            this.connector.listen('scopes:all:get:back', (scopes) => {
                // After we got the scopes, add them and callback the result
                scopes = JSON.parse(scopes);

                // Empty all known scopes
                this.scopes = [];
                for (var scope of scopes) {
                    // Create a new scope
                    var newProject = new ProjectClass(scope["hostname"], scope["IP"], scope["scopeID"], scope["projectName"]);
                    this.scopes.push(newProject);
                }

                // Callback everything, we just saved
                callback(this.getScopes());
            });            
        });        
    }

    getScopes() {
        return this.scopes;
    }

}

export default ScopeManager;