import _ from 'lodash';

import { 
	ADD_FILES_IPS,
	ADD_FILES_HOSTS,
	EMPTY_FILES,

	RENEW_FILES_STATS,
	SET_LOADING_FILES,
	RECEIVE_FILES_STATS_HOSTS,
	RECEIVE_FILES_STATS_IPS
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


function empty_files(state = defaultState, action) {
	return {
		"stats": state['stats'],
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": defaultState['files']
	};
}


function renewFilesStats(state = defaultState, action) {
	return {
		...state,
		'amount': action.amount
	};
}

function setLoadingFiles(state = defaultState, action) {
	return {
		...state,
		'loaded': !action.loading
	}
}

function receiveFilesStatsHosts(state = defaultState, action) {
	const stats = action.stats;

	// TODO: merge stats['stats'] with the previous state
	// This can help if we need to reload statsics on a single file
	// Also this will fix a nasty race condition.
	//   When the first page loads too long and the second - too fast,
	//   files will be set to the first result, not the second
	return {
		"stats": {
			"host": stats,
			"ip": state.stats.ip
		},
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": state['files']
	};
}

function receiveFilesStatsIPs(state = defaultState, action) {
	const stats = action.stats;

	// TODO: merge stats['stats'] with the previous state
	// This can help if we need to reload statsics on a single file
	// Also this will fix a nasty race condition.
	//   When the first page loads too long and the second - too fast,
	//   files will be set to the first result, not the second
	return {
		"stats": {
			"host": state.stats.ip,
			"ip": stats
		},
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": state['files']
	};
}

function file_reduce(state = defaultState, action) {
	switch (action.type) {
		case ADD_FILES_HOSTS:
			return add_files_hosts(state, action);
		case ADD_FILES_IPS:
			return add_files_ips(state, action);		
		case EMPTY_FILES:
			return empty_files(state, action);

		case RENEW_FILES_STATS:
			return renewFilesStats(state, action);
		case SET_LOADING_FILES:
			return setLoadingFiles(state, action);
		case RECEIVE_FILES_STATS_HOSTS:
			return receiveFilesStatsHosts(state, action);
		case RECEIVE_FILES_STATS_IPS:
			return receiveFilesStatsIPs(state, action);
			
		default:
			return state;
	}
}


export default file_reduce
