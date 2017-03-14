import Connector from '../common/SocketConnector.jsx';

class ProjectClass
{

    constructor(project_name, project_uuid, comment)
    {
        this.project_name = project_name;
        this.project_uuid = project_uuid;
        this.comment = comment;
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

            this.callback = null;
        }

        return instance;
    }

    initialize(callback) {
        // Upon connecting to the server, request the data
        this.connector.after_connected(() => {
            this.connector.emit('projects:all:get');

            this.callback = callback;
            this.register_projects_new(callback);
            this.register_project_create_single(callback);
            this.register_project_delete(callback);
        });
    }

    register_projects_new(callback) {
        this.connector.listen('projects:all:get:back', (projects) => {
            // After we got the projects, add them and callback the result
            projects = JSON.parse(projects);

            // Empty all known projects
            this.projects = [];
            for (var project of projects) {
                // Create a new project
                var newProject = new ProjectClass(project["project_name"], project["project_uuid"], project["comment"]);
                this.register_project_update(project["project_uuid"], this.callback);

                this.projects.push(newProject);
            }

            // Callback everything, we have
            callback({
                'status': 'success',
                'projects': this.getProjects()
            });
        }); 
    }

    register_project_create_single(callback) {
        this.connector.listen('projects:create', (msg) => {
            var parsed_msg = JSON.parse(msg);

            if (parsed_msg['status'] == 'success') {
                var project = parsed_msg['new_project']
                var project_uuid = project['project_uuid'];

                var newProject = new ProjectClass(project['project_name'], project['project_uuid'], project['comment']);
                this.register_project_update(project["project_uuid"], this.callback);

                this.projects.push(newProject);

                callback({
                    'status': 'success',
                    'projects': this.getProjects()
                });
            }
            else {
                callback({
                    'status': 'error',
                    'text': parsed_msg['text']
                });
            }
        });
    }

    register_project_delete(callback) {
        this.connector.listen('projects:delete', (msg) => {
            const parsed_msg = JSON.parse(msg);
            const project_uuid = parsed_msg['project_uuid'];

            if (parsed_msg['status'] == 'success') {
                this.projects = _.filter(this.projects, (x) => {
                    return x['project_uuid'] != project_uuid;
                });

                callback({
                    'status': 'success',
                    'projects': this.getProjects()
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

    register_project_update(project_uuid, callback) {
        this.connector.listen('projects:update:' + project_uuid, (msg) => {
            var parsed_msg = JSON.parse(msg);

            if (parsed_msg['status'] == 'success') {

                // OK
                callback({
                    'status': 'success',
                    'projects': this.getProjects()
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

    createProject(project_name) {
        this.connector.emit('projects:create', {
            project_name: project_name
        });
    }

    deleteProject(project_uuid) {
        this.connector.emit('projects:delete:project_uuid', project_uuid);
    }

    updateProject(project_uuid, project_name=null, comment=null) {
        this.connector.emit('projects:update', {
            project_uuid: project_uuid,
            project_name: project_name,
            comment: comment
        });
    }

    getProjects() {
        return this.projects;
    }

}

export default ProjectManager;
