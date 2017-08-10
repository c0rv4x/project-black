import { combineReducers } from 'redux'

import project_reduce from './projects/reducers';
import scope_reduce from './scopes/reducers';
import task_reduce from './tasks/reducers';
import scan_reduce from './scans/reducers';
import file_reduce from './files/reducers';
import filter_reduce from './filters/reducers';


const all_reducers = combineReducers({
	projects: project_reduce,
	scopes: scope_reduce,
	tasks: task_reduce,
	scans: scan_reduce,
	files: file_reduce,
	filters: filter_reduce
});


export default all_reducers;
