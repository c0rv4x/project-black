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
        this.state = {"projects" : [new ProjectClass("project_1", "uuid_1")]}; // <- set store's default state much like in React
        this.listenables = ProjectActions;
    }

    onDelete(projectUUID)
    {
        alert("Deleting " + projectUUID);
    }
}

export default ProjectStore