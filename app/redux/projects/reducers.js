import _ from 'lodash';

import { 
	CREATE_PROJECT, 
	DELETE_PROJECT, 
	UPDATE_PROJECT, 
	UPDATE_COMMENT, 
	RENEW_PROJECTS 
} from './actions.js'


const initialState = {
	projects: []
}

function create_project(state = [], action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var state_new = JSON.parse(JSON.stringify(state));

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
		var state_new = JSON.parse(JSON.stringify(state));

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

function update_comment(state = [], action) {
	const project_uuid = action.message['project_uuid'];
	const new_comment = action.message['comment'];

	var new_state = JSON.parse(JSON.stringify(state));
	for (var project of new_state) {
		if (project.project_uuid == project_uuid) {
			project.comment = new_comment;
		}
		else continue
	}

	return new_state;
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
		case UPDATE_COMMENT:
			return update_comment(state, action);			
		default:
			return state;
	}
}


export default project_reduce
