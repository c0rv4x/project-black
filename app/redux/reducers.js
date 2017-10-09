import { combineReducers } from 'redux'

import project_reduce from './projects/reducers';
import scope_reduce from './scopes/reducers';
import task_reduce from './tasks/reducers';
import scan_reduce from './scans/reducers';
import file_reduce from './files/reducers';
import filter_reduce from './filters/reducers';
import {reducer as notifications} from 'react-notification-system-redux';


const all_reducers = combineReducers({
	tasks: task_reduce,
	projects: project_reduce,
	scopes: scope_reduce,
	scans: scan_reduce,
	files: file_reduce,
	filters: filter_reduce,
	notifications: notifications
});


export default all_reducers;
