import _ from 'lodash';

import { 
	RECEIVE_PROJECTS
} from './actions.js'


const initialState = {
	projects: []
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
		case RECEIVE_PROJECTS:
			return receiveProjects(state, action);		
		default:
			return state;
	}
}


export default project_reduce
