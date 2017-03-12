import Connector from '../common/SocketConnector.jsx';

class ProjectClass
{

    constructor(project_name, uuid)
    {
        this.project_name = project_name;
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
        this.connector.after_connected(() => {
            this.connector.emit('projects:all:get');
            this.connector.listen('projects:all:get:back', (projects) => {
                // After we got the projects, add them and callback the result
                projects = JSON.parse(projects);

                // Empty all known projects
                this.projects = [];
                for (var project of projects) {
                    // Create a new project
                    var newProject = new ProjectClass(project["project_name"], project["uuid"]);
                    this.projects.push(newProject);
                }

                // Callback everything, we have
                callback(this.getProjects());
            });            
        });
    }

    createProject(project_name, callback) {
        this.connector.emit('projects:create', {
            project_name: project_name
        });

        this.connector.listen('projects:create:' + project_name, (msg) => {
            var parsed_msg = JSON.parse(msg);

            if (parsed_msg['status'] == 'success') {
                var project = parsed_msg['newProject']
                var uuid = project['uuid'];

                var newProject = new ProjectClass(project_name, uuid);
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
                    'text': parsed_msg['text']
                });                
            }
         
        });        

    }

    deleteProject(uuid, callback) {
        this.connector.emit('projects:delete:uuid', uuid);
        this.connector.listen('projects:delete:uuid:' + uuid, (msg) => {
            var parsed_msg = JSON.parse(msg);

            if (parsed_msg['status'] == 'success') {
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
