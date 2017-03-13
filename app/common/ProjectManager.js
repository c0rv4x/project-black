import Connector from '../common/SocketConnector.jsx';

class ProjectClass
{

    constructor(project_name, project_uuid)
    {
        this.project_name = project_name;
        this.project_uuid = project_uuid;
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
                    var newProject = new ProjectClass(project["project_name"], project["project_uuid"]);
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
                var project_uuid = project['project_uuid'];

                var newProject = new ProjectClass(project_name, project_uuid);
                this.projects.push(newProject);
                // OK
                callback({
                    'status': 'success',
                    'newProject': newProject
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

    deleteProject(project_uuid, callback) {
        this.connector.emit('projects:delete:project_uuid', project_uuid);
        this.connector.listen('projects:delete:project_uuid:' + project_uuid, (msg) => {
            var parsed_msg = JSON.parse(msg);

            if (parsed_msg['status'] == 'success') {
                this.projects = _.filter(this.projects, (x) => {
                    return x['project_uuid'] != project_uuid;
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
