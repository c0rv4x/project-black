import _ from 'lodash';

import { 
	SET_DICTS
} from './actions.js'

const default_value = {
	"amount": 0,
	"dicts": []
};

function set_dicts(state=default_value, action) {
	const dicts = action.dicts;

	return {
		"amount": state["amount"],
		"dicts": dicts
	}
}

function dicts_reduce(state=default_value, action) {
		switch (action.type) {
			case SET_DICTS:
				return set_dicts(state, action);                    
			default:
				return state;
		}
}


export default dicts_reduce
