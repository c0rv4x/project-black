import _ from 'lodash';

import { 
	RENEW_FILES_STATS,
	SET_LOADING_FILES,
	RECEIVE_FILES_STATS_HOSTS,
	RECEIVE_FILES_STATS_IPS,
	RECEIVE_FILES_DATA_HOSTS,
	RECEIVE_FILES_DATA_IPS
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

function receiveFilesDataHosts(state = defaultState, action) {
	const files = action.files;
	const host = action.host;
	const port_number = action.port_number;

	let new_files = JSON.parse(JSON.stringify(state['files']));

	if (new_files.host.hasOwnProperty(host)) {
		if (new_files.host[host].hasOwnProperty(port_number)) {
			new_files.host[host][port_number] = new_files.host[host][port_number].concat(files);
		}
		else {
			new_files.host[host][port_number] = files;
		}
	}
	else {
		new_files.host[host] = {};
		new_files.host[host][port_number] = files;
	}

	return {
		"stats": state['stats'],
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": new_files
	};
}

function receiveFilesDataIPs(state = defaultState, action) {
	const files = action.files;
	const ip = action.ip;
	const port_number = action.port_number;

	let new_files = JSON.parse(JSON.stringify(state['files']));

	if (new_files.ip.hasOwnProperty(ip)) {
		if (new_files.ip[ip].hasOwnProperty(port_number)) {
			new_files.ip[ip][port_number] = new_files.ip[ip][port_number].concat(files);
		}
		else {
			new_files.ip[ip][port_number] = files;
		}
	}
	else {
		new_files.ip[ip] = {};
		new_files.ip[ip][port_number] = files;
	}

	return {
		"stats": state['stats'],
		"amount": state['amount'],
		"loaded": state['loaded'],
		"files": new_files
	};
}

function file_reduce(state = defaultState, action) {
	switch (action.type) {
		case RENEW_FILES_STATS:
			return renewFilesStats(state, action);
		case SET_LOADING_FILES:
			return setLoadingFiles(state, action);
		case RECEIVE_FILES_STATS_HOSTS:
			return receiveFilesStatsHosts(state, action);
		case RECEIVE_FILES_STATS_IPS:
			return receiveFilesStatsIPs(state, action);
		case RECEIVE_FILES_DATA_HOSTS:
			return receiveFilesDataHosts(state, action);
		case RECEIVE_FILES_DATA_IPS:
			return receiveFilesDataIPs(state, action);
		default:
			return state;
	}
}


export default file_reduce
