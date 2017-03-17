import _ from 'lodash';

import { 
	CREATE_PROJECT, 
	DELETE_PROJECT, 
	UPDATE_PROJECT, 
	RENEW_PROJECTS 
} from './actions.js'


const initialState = {
	projects: []
}

function create_project(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var state_new = state.slice();

		state_new.push({
			"project_name": message["new_project"]["project_name"],
			"project_uuid": message["new_project"]["project_uuid"],
			"comment": message["new_project"]["comment"]
		});

		return state_new;
	} else {
		/* TODO: add error handling */
	}
}

function delete_project(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var state_new = state.slice();

		var projects_filtered = _.filter(state_new, (x) => {
			return x["project_uuid"] != message["project_uuid"];
		});
		state_new = projects_filtered;

		return state_new;
	} else {
		/* TODO: add error handling */
	}
}

function renew_projects(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var state_new = message['projects'];

		return state_new;
	} else {
		/* TODO: add error handling */
	}		
}

function update_project(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var new_project = message["new_project"];
		var project_name = null;

		var state_new = _.filter(state, (x) => {
			var matches_filter = x.project_uuid != new_project.project_uuid;

			if (!matches_filter) project_name = x.project_name;

			return matches_filter;
		});

		if (new_project.project_name === null) new_project.project_name = project_name;

		state_new.push(new_project);

		return state_new;
	} else {
		/* TODO: add error handling */
	}		
}

function project_reduce(state = [], action) {
	switch (action.type) {
		case CREATE_PROJECT:
			return create_project(state, action);
		case DELETE_PROJECT:
			return delete_project(state, action);
		case RENEW_PROJECTS:
			return renew_projects(state, action);
		case UPDATE_PROJECT:
			return update_project(state, action);
		default:
			return state;
	}
}


export default project_reduce