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
        this.projectManager.initialize(this.initializeProjects.bind(this));

        this.listenables = ProjectActions;
    }

    initializeProjects(projects) {
        this.loading("", false);

        this.setState({
            projects: projects
        });
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

        this.projectManager.createProject(project_name, (result) => {
            if (result['status'] == 'success') {
                this.setState({
                    projects: this.projectManager.getProjects()
                });

                this.loading("", false);
            }
            else {
                this.loading(result['text'], false);                
            }
        });
    }

    onDelete(project_uuid)
    {
        this.loading("", true);

        this.projectManager.deleteProject(project_uuid, (result) => {
            if (result['status'] == 'success') {
                this.setState({
                    projects: this.projectManager.getProjects()
                });

                this.loading("", false);
            }
            else {
                this.loading(result['text'], false);
            }
         
        });        
    }

    onCommit(project_uuid, project_name=null, comment=null) 
    {
        this.loading("", true);
        this.projectManager.updateProject(project_uuid, project_name, comment, (result) => {
            if (result['status'] == 'success') {

                var projects = this.state.projects;
                for (var i = 0; i < projects.length; i++) {
                    if (projects[i]["project_uuid"] == project_uuid) {
                        if (project_name) projects[i]["project_name"] = project_name;
                        if (comment) projects[i]["comment"] = comment;
                        break;
                    } 
                }

                this.setState({
                    projects: projects
                });

                this.loading("", false);
            }
            else {
                this.loading(result['text'], false);
            }
         
        });  

    }    
}

export default ProjectStore
