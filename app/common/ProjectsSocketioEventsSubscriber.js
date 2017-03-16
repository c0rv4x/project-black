import { 
	createProject, 
	deleteProject,
	renewProjects,
	updateProject
} from './redux/actions';

import Connector from './SocketConnector.jsx';


let instance = null;

class ProjectsEventsSubsriber {
	/* Singleton class for managing events subscription for the projects */
	constructor(store) {
        if(!instance){
            instance = this;

            this.store = store;
            this.connector = new Connector();

            this.connector.after_connected((x) => {
            	this.connector.emit('projects:all:get');
            });
        }

        return instance;
	}

	basic_events_registration() {
		/* Register handlers on basic events */

		// Received all projects in one message
		this.register_socketio_handler('projects:all:get:back', renewProjects);

		// Backend tried to create a new project (both: successfully and not successfully)
		this.register_socketio_handler('projects:create', createProject);

		// Backend tried to delete a project (both: successfully and not successfully)
		this.register_socketio_handler('projects:delete', deleteProject);

		/* 
		Should be:
		this.register_socketio_handler('projects:update:{project_uuid}', updateProject); 

		This event should be handled separately for each project.
		On creating a new project, we need to separately assign such event 
		*/
	}

	register_project_update(project_uuid) {
		/* After new project has been created, call this method to subscribe updates
		on this project */
		this.register_socketio_handler('projects:update:' + project_uuid, updateProject);
	}

	register_socketio_handler(eventName, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (x) => {
			this.store.dispatch(callback(x));
		});
	}
}

export default ProjectsEventsSubsriber;