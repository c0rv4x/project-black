import Connector from '../common/SocketConnector.jsx';

class ProjectClass
{

    constructor(projectName, scope, uuid)
    {
        this.projectName = projectName;
        this.scope = scope;
        this.uuid = uuid;
    }

}

let instance = null;

class ProjectManager 
{

    constructor() {
        if(!instance){
            instance = this;
            this.connector = new Connector();

            this.projects = [];
        }

        return instance;
    }

    initialize(callback) {
        // Upon connecting to the server, request the data
        this.connector.listen('connect', () => {
            this.connector.emit('projects:all:get');
            this.connector.listen('projects:all:get:back', (projects) => {
                // After we got the projects, add them and callback the result
                projects = JSON.parse(projects);

                // Empty all known projects
                this.projects = [];
                for (var project of projects) {
                    // Create a new project
                    var newProject = new ProjectClass(project["projectName"], project["scope"], project["uuid"]);
                    this.projects.push(newProject);
                }

                // Callback everything, we have
                callback(this.getProjects());
            });            
        });
    }

    createProject(projectName, scope, callback) {
        this.connector.emit('projects:create', {
            projectName: projectName,
            scope: scope
        });

        this.connector.listen('projects:create:' + projectName, (msg) => {
            var parsedMsg = JSON.parse(msg);

            if (parsedMsg['status'] == 'success') {
                var project = parsedMsg['newProject']
                var uuid = project['uuid'];

                var newProject = new ProjectClass(projectName, scope, uuid);
                this.projects.push(newProject);
                // OK
                callback({
                    'status': 'success',
                    'newProject': newProject
                });
            }
            else {
                // Err
                console.log(callback);
                callback({
                    'status': 'error',
                    'text': parsedMsg['text']
                });                
            }
         
        });        

    }

    deleteProject(uuid, callback) {
        this.connector.emit('projects:delete:uuid', uuid);
        this.connector.listen('projects:delete:uuid:' + uuid, (msg) => {
            var parsedMsg = JSON.parse(msg);

            if (parsedMsg['status'] == 'success') {
                this.projects = _.filter(this.projects, (x) => {
                    return x['uuid'] != uuid;
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

    getProjects() {
        return this.projects;
    }

}

export default ProjectManager;