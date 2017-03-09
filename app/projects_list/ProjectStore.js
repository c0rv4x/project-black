var _ = require('lodash');
var Reflux = require('reflux');
var ProjectActions = require('./ProjectActions.js');


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
    }

    onCreate(projectName, uuid)
    {
        var projects = this.state.projects;
        projects.push(new ProjectClass(projectName, uuid));
        this.setState(projects : projects);

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