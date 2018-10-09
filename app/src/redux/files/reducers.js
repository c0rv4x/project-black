import _ from 'lodash';

import { 
	RENEW_TOTAL_AMOUNT,
	ADD_STATS_HOSTS,
	ADD_STATS_IPS,
	ADD_FILES_IPS,
	ADD_FILES_HOSTS
} from './actions.js'


// TODO: the loaded variable should be named something like 
// 'total_amount_loaded' or something similar
const defaultState = {
	"stats": {
		"ip": {},
		"host": {}		
	},
	"amount": 0,
	"loaded": false,
	"files": {
		"ip": {},
		"host": {}
	}
}

function renew_total_amount(state = defaultState, action) {
	const message = action.message;

	return {
		"stats": state['stats'],
		"amount": message['amount'],
		"loaded": true,
		"files": state['files']
	};
}

function add_stats_hosts(state = defaultState, action) {
	const message = action.message;

	// TODO: merge message['stats'] with the previous state
	// This can help if we need to reload statsics on a single file
	// Also this will fix a nasty race condition.
	//   When the first page loads too long and the second - too fast,
	//   files will be set to the first result, not the second
	return {
		"stats": {
			"host": message['stats'],
			"ip": state.stats.ip
		},
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": state['files']
	};
}

function add_stats_ips(state = defaultState, action) {
	const message = action.message;

	// TODO: merge message['stats'] with the previous state
	// This can help if we need to reload statsics on a single file
	// Also this will fix a nasty race condition.
	//   When the first page loads too long and the second - too fast,
	//   files will be set to the first result, not the second
	return {
		"stats": {
			"host": state.stats.host,
			"ip": message['stats']
		},
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": state['files']
	};
}

function add_files_hosts(state = defaultState, action) {
	const message = action.message;

	let new_files = JSON.parse(JSON.stringify(state['files']));

	if (new_files.host.hasOwnProperty(message.host)) {
		if (new_files.host[message.host].hasOwnProperty(message.port_number)) {
			new_files.host[message.host][message.port_number] = new_files.host[message.host][message.port_number].concat(message['files']);
		}
		else {
			new_files.host[message.host][message.port_number] = message['files'];
		}
	}
	else {
		new_files.host[message.host] = {};
		new_files.host[message.host][message.port_number] = message['files'];
	}

	return {
		"stats": state['stats'],
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": new_files
	};
}

function add_files_ips(state = defaultState, action) {
	const message = action.message;
	let new_files = JSON.parse(JSON.stringify(state['files']));

	if (new_files.ip.hasOwnProperty(message.ip)) {
		if (new_files.ip[message.ip].hasOwnProperty(message.port_number)) {
			new_files.ip[message.ip][message.port_number] = new_files.ip[message.ip][message.port_number].concat(message['files']);
		}
		else {
			new_files.ip[message.ip][message.port_number] = message['files'];
		}
	}
	else {
		new_files.ip[message.ip] = {};
		new_files.ip[message.ip][message.port_number] = message['files'];
	}

	return {
		"stats": state['stats'],
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": new_files
	};
}

function file_reduce(state = defaultState, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}
	else {	
		if (action.message && action.current_project_uuid != action.message.project_uuid) { return state; }
		else {	
			switch (action.type) {
				case RENEW_TOTAL_AMOUNT:
					return renew_total_amount(state, action);
				case ADD_STATS_HOSTS:
					return add_stats_hosts(state, action);
				case ADD_STATS_IPS:
					return add_stats_ips(state, action);					
				case ADD_FILES_HOSTS:
					return add_files_hosts(state, action);
				case ADD_FILES_IPS:
					return add_files_ips(state, action);										
				default:
					return state;
			}
		}
	}
}


export default file_reduce
