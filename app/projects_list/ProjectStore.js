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
            this.connector.listen('projects:all:get:back', this.updateProjects.bind(this));            
        });
    }

    updateProjects(projects) {
        this.setState({
            errorMessage: "", 
            loading: false
        });
        projects = JSON.parse(projects);

        var recvProjects = [];

        for (var project of projects) {
            console.log(project);
            recvProjects.push(new ProjectClass(project["projectName"], project["uuid"]));
        }

        this.state.projects = recvProjects;
        this.trigger(this.state);
    }

    onCreate(projectName)
    {
        this.setState({
            errorMessage: "", 
            loading: true
        });
        this.trigger(this.state);

        var projects = this.state.projects;

        this.connector.emit('projects:create', projectName);
        this.connector.listen('projects:create:' + projectName, (msg) => {
            var parsedMsg = JSON.parse(msg);

            if (parsedMsg['status'] == 'success') {
                var project = parsedMsg['text']
                var uuid = project['uuid'];

                projects.push(new ProjectClass(projectName, uuid));

                this.setState({
                    projects: projects,
                    errorMessage: "", 
                    loading: false
                });

                this.trigger(this.state);
            }
            else {
                this.setState({
                    projects: projects,
                    errorMessage: parsedMsg['text'], 
                    loading: false
                });
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