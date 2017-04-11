import { combineReducers } from 'redux'

import project_reduce from './projects/reducers';
import scope_reduce from './scopes/reducers';
import task_reduce from './tasks/reducers';
import scan_reduce from './scans/reducers';


const rdcs = combineReducers({
	projects: project_reduce,
	scopes: scope_reduce,
	tasks: task_reduce,
	scans: scan_reduce
})

export default rdcs;