import _ from 'lodash';
import Reflux from 'reflux';
import io from 'socket.io-client';

import ProjectActions from './ProjectActions.js';


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
        this.state = {"projects" : [new ProjectClass("project_1", "uuid_1")]};
        this.listenables = ProjectActions;

        this.socketio = io("http://127.0.0.1:5000");
        this.socketio.on('connect', () => {
            this.socketio.emit('projects:all');
            this.socketio.on('projects:all:back', this.updateProjects.bind(this));
        });   
    }

    updateProjects(projects) {
        this.state.errorMessage = '';
        this.state.loading = false;
        projects = JSON.parse(projects);

        var recvProjects = [];

        for (var project of projects) {
            console.log(project);
            recvProjects.push(new ProjectClass(project["projectName"], project["uuid"]));
        }

        this.state.projects = recvProjects;
        this.trigger(this.state);
    }

    onCreate(projectName, uuid)
    {
        var projects = this.state.projects;
        projects.push(new ProjectClass(projectName, uuid));
        this.setState(projects: projects);

        this.trigger(this.state);
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