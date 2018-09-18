import _ from 'lodash';

import { 
	CREATE_SCOPE
} from './actions.js'


const initialState = {
	"scopes_created": null
}

function create_scope(state = initialState, action) {
	const message = action.message;

	let new_state = {};

	new_state.scopes_created = message["status"];

	return new_state;
}

function scope_reduce(state = initialState, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}

	else {
		if (action.message && action.current_project_uuid != action.message.project_uuid) { return state; }
		else {
			switch (action.type) {
				case CREATE_SCOPE:
					return create_scope(state, action);
				default:
					return state;
			}
		}
	}
}



export default scope_reduce
