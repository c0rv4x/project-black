import _ from 'lodash';

import { 
	SET_PROJECT_UUID
} from './actions.js'


const initialState = 0;


function setProjectUuid(state = initialState, action) {
	const project_uuid = action.project_uuid;

	return project_uuid;
}


function project_uuid_reduce(state = initialState, action) {
    switch (action.type) {
        case SET_PROJECT_UUID:
            return setProjectUuid(state, action);
        default:
            return state;
    }
}



export default project_uuid_reduce
