import _ from 'lodash';
import Reflux from 'reflux';

import ProjectActions from './ProjectActions.js';
import ProjectManager from '../common/ProjectManager.js';


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
        // Create project manage
        this.projectManager = new ProjectManager();

        // Obtain the data and redraw the table
        this.projectManager.initialize(this.update_projects.bind(this));

        this.listenables = ProjectActions;
    }

    update_projects(result) {
        if (result['status'] == 'success') {
            this.setState({
                projects: result['projects']
            });            
            this.loading("", false);
        }
        else {
            this.loading(result['text'], false);
        }
    }

    loading(errorMessage, status) {
        // Make a mark that loading status = 'status'
        this.setState({
            errorMessage: errorMessage, 
            loading: status
        });

        this.trigger(this.state);        
    }

    onCreate(project_name)
    {
        this.loading("", true);

        this.projectManager.createProject(project_name);
    }

    onDelete(project_uuid)
    {
        this.loading("", true);

        this.projectManager.deleteProject(project_uuid);        
    }

    onCommit(project_uuid, project_name=null, comment=null) 
    {
        this.loading("", true);

        this.projectManager.updateProject(project_uuid, project_name, comment);  

    }    
}

export default ProjectStore
