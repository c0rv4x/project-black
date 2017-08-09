import { combineReducers } from 'redux'

import project_reduce from './projects/reducers';
import scope_reduce from './scopes/reducers';
import task_reduce from './tasks/reducers';
import scan_reduce from './scans/reducers';
import file_reduce from './files/reducers';
import filter_reduce from './filters/reducers';
import current_project_reduce from './current_project/reducers';


const combined = combineReducers({
	projects: project_reduce,
	scopes: scope_reduce,
	tasks: task_reduce,
	scans: scan_reduce,
	files: file_reduce,
	filters: filter_reduce,
	current_project: current_project_reduce
});


const rdcs = function(state, action) {
	switch (action.type) {
		case "RENEW_FILES": {
			return {
				projects: state.projects,
				scopes: state.scopes,
				tasks: state.tasks,
				scans: state.scans,
				files: file_reduce(state.files, action, state.current_project),
				filters: state.filters,
				current_project: state.current_project
			}
		}
		case "RENEW_SCOPES": {
			return {
				projects: state.projects,
				scopes: scope_reduce(state.scopes, action, state.current_project),
				tasks: state.tasks,
				scans: state.scans,
				files: state.files,
				filters: state.filters,
				current_project: state.current_project
			}			
		}
		default: {
			return combined(state, action);
		}
	}
}


export default rdcs;
