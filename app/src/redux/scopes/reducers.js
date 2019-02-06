import _ from 'lodash';

import { 
	SET_SCOPES_CREATED
} from './actions.js'


const initialState = {
	"scopes_created": true
}

function setScopesCreated(state = initialState, action) {
	return {
		scopes_created: action.scopeCreated
	}
}

function scope_reduce(state = initialState, action) {
	switch (action.type) {
		case SET_SCOPES_CREATED:
			return setScopesCreated(state, action);
		default:
			return state;
	}
}



export default scope_reduce
