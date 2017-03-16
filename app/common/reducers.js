import { combineReducers } from 'redux'

import project_reduce from './projects/reducers';
import scope_reduce from './scopes/reducers';


const rdcs = combineReducers({
	projects: project_reduce,
	scopes: scope_reduce
})

export default rdcs;