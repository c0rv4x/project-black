import _ from 'lodash';
import Reflux from 'reflux';

import ProjectActions from './ProjectActions.js';
import Connector from '../SocketConnector.jsx';


class ProjectClass
{

    constructor(projectName, scope, uuid)
    {
        this.projectName = projectName;
        this.scope = scope;
        this.uuid = uuid;
    }

}

class ProjectStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            "projects" : [],
            "loading": false,
            "errorMessage": null
        };
        this.listenables = ProjectActions;

        this.connector = new Connector();
        this.connector.listen('connect', () => {
            this.connector.emit('projects:all:get');
            this.connector.listen('projects:all:get:back', this.initializeProjects.bind(this));            
        });
    }

    initializeProjects(projects) {
        this.loading("", false);

        projects = JSON.parse(projects);

        var recvProjects = [];
        for (var project of projects) {
            recvProjects.push(new ProjectClass(project["projectName"], project["scope"], project["uuid"]));
        }

        this.setState({
            projects: recvProjects
        });
        this.trigger(this.state);
    }

    loading(errorMessage, status) {
        // Make a mark that loading status = 'status'
        this.setState({
            errorMessage: errorMessage, 
            loading: status
        });

        this.trigger(this.state);        
    }

    onCreate(projectName, scope)
    {
        this.loading("", true);

        var projects = this.state.projects;

        // Send a note that we want to create a project
        this.connector.emit('projects:create', {
            projectName: projectName,
            scope: scope
        });

        // Receive the data about the created project
        this.connector.listen('projects:create:' + projectName, (msg) => {
            var parsedMsg = JSON.parse(msg);

            if (parsedMsg['status'] == 'success') {
                var project = parsedMsg['text']
                var uuid = project['uuid'];

                projects.push(new ProjectClass(projectName, scope, uuid));
                this.setState({
                    projects: projects
                });

                this.loading("", false);
            }
            else {
                this.loading(parsedMsg['text'], false);
            }
         
        });
    }

    onDelete(uuid)
    {
        this.loading("", true);

        this.connector.emit('projects:delete:uuid', uuid);
        this.connector.listen('projects:delete:uuid:' + uuid, (msg) => {
            var parsedMsg = JSON.parse(msg);

            if (parsedMsg['status'] == 'success') {
                var projects = _.filter(this.state.projects, (x) => {
                    return x['uuid'] != uuid;
                });

                this.setState({
                    projects: projects
                });

                this.loading("", false);
            }
            else {
                this.loading(parsedMsg['text'], false);
            }
         
        });        
    }
}

export default ProjectStore