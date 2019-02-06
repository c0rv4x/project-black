import { combineReducers } from 'redux'

import project_reduce from './projects/reducers';
import project_uuid_reduce from './project_uuid/reducers';
import ip_reduce from './ips/reducers';
import host_reduce from './hosts/reducers';
import task_reduce from './tasks/reducers';
import scan_reduce from './scans/reducers';
import file_reduce from './files/reducers';
import filter_reduce from './filters/reducers';
import notification_reduce from './notifications/reducers';
import scope_reduce from './scopes/reducers';
import creds_reduce from './creds/reducers';
import dicts_reduce from './dicts/reducers';


const all_reducers = combineReducers({
	tasks: task_reduce,
	projects: project_reduce,
	project_uuid: project_uuid_reduce,
	ips: ip_reduce,
	hosts: host_reduce,
	scans: scan_reduce,
	files: file_reduce,
	filters: filter_reduce,
	notifs: notification_reduce,
	scopes: scope_reduce,
	creds: creds_reduce,
	dicts: dicts_reduce
});

export default all_reducers;
