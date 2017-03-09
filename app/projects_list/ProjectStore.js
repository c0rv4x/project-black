import _ from 'lodash';
import Reflux from 'reflux';

import ProjectActions from './ProjectActions.js';
import Connector from '../SocketConnector.jsx';


class ProjectClass
{

    constructor(projectName, uuid)
    {
        this.projectName = projectName;
        this.uuid = uuid;
    }

}

class ProjectStore extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            "projects" : [new ProjectClass("project_1", "uuid_1")],
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
            recvProjects.push(new ProjectClass(project["projectName"], project["uuid"]));
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

    onCreate(projectName)
    {
        this.loading("", true);

        var projects = this.state.projects;

        this.connector.emit('projects:create', projectName);
        this.connector.listen('projects:create:' + projectName, (msg) => {
            var parsedMsg = JSON.parse(msg);

            if (parsedMsg['status'] == 'success') {
                var project = parsedMsg['text']
                var uuid = project['uuid'];

                projects.push(new ProjectClass(projectName, uuid));

                this.loading("", false);
            }
            else {
                this.loading(parsedMsg['text'], false);
            }
         
        });
    }

    onDelete(uuid)
    {
        var projects = this.state.projects;
        var targeted = _.findIndex(projects, {'uuid' : uuid});
        projects.splice(targeted, 1);

        this.trigger(this.state);
    }
}

export default ProjectStore