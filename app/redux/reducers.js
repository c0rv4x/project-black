import { combineReducers } from 'redux'

import project_reduce from './projects/reducers';
import ip_reduce from './ips/reducers';
import host_reduce from './hosts/reducers';
import task_reduce from './tasks/reducers';
import scan_reduce from './scans/reducers';
import file_reduce from './files/reducers';
import filter_reduce from './filters/reducers';
import notification_reduce from './notifications/reducers';


const all_reducers = combineReducers({
	tasks: task_reduce,
	projects: project_reduce,
	ips: ip_reduce,
	hosts: host_reduce,
	scans: scan_reduce,
	files: file_reduce,
	filters: filter_reduce,
	notifications: notification_reduce
});

export default all_reducers;
