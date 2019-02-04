import _ from 'lodash';

import { 
	CREATE_PROJECT, 
	DELETE_PROJECT, 
	UPDATE_PROJECT, 
	UPDATE_COMMENT, 
	RENEW_PROJECTS ,

	RECEIVE_PROJECTS
} from './actions.js'


const initialState = {
	projects: []
}

function create_project(state = [], action) {
	const message = action.message;

	var state_new = state.slice();

	state_new.push({
		"project_name": message["new_project"]["project_name"],
		"project_uuid": message["new_project"]["project_uuid"],
		"comment": message["new_project"]["comment"]
	});

	return state_new;
}

function delete_project(state = [], action) {
	const message = action.message;

	var state_new = state.slice();

	var projects_filtered = _.filter(state_new, (x) => {
		return x["project_uuid"] != message["project_uuid"];
	});
	state_new = projects_filtered;

	return state_new;
}

function renew_projects(state = [], action) {
	const message = action.message;

	var state_new = message['projects'].sort((a, b) => {
		if (a.project_uuid > b.project_uuid) return 1;
		if (a.project_uuid < b.project_uuid) return -1;
		return 0;
	});

	return state_new;
}

function update_project(state = [], action) {
	const message = action.message;

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
}

function update_comment(state = [], action) {
	const project_uuid = action.message['project_uuid'];
	const new_comment = action.message['comment'];

	var new_state = state.slice();
	for (var project of new_state) {
		if (project.project_uuid == project_uuid) {
			project.comment = new_comment;
		}
		else continue
	}

	return new_state;
}


function receiveProjects(state = [], action) {
	const message = action.message;

	var newState = message.sort((a, b) => {
		if (a.project_uuid > b.project_uuid) return 1;
		if (a.project_uuid < b.project_uuid) return -1;
		return 0;
	});

	return newState;
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
		case RECEIVE_PROJECTS:
			return receiveProjects(state, action);		
		default:
			return state;
	}
}


export default project_reduce
