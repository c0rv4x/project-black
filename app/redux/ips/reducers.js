import _ from 'lodash';

import { 
	CREATE_IP, 
	DELETE_IP, 
	RENEW_IPS,
	UPDATE_IP
} from './actions.js'


const initialState = {
	"page": 0,
	"page_size": 12,
	"total_db_ips": 0,
	"selected_ips": 0,
	"data": [],
	"update_needed": false
}

function create_ip(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		let new_state = JSON.parse(JSON.stringify(state));
		let new_ips = message.new_ips;

		new_state.data = new_ips.concat(new_state.data).slice(0, new_state.page_size);
		new_state.total_db_ips += new_ips.length;

		if (new_state.page_size > new_state.selected_ips) {
			new_state.selected_ips += 1;
		}

		new_state.update_needed = false;			

		return new_state;
	} else {
		/* TODO: add error handling */
	}
}

function delete_ip(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		var new_state = JSON.parse(JSON.stringify(state));
		new_state.update_needed = true;

		return new_state;
	} else {
		/* TODO: add error handling */
	}
}

function renew_ips(state = initialState, action) {
	const message = action.message;

	if (message["status"] == 'success') {
		return {
			...message.ips,
			'update_needed': false
		}
	} else {
		/* TODO: add error handling */
	}
}

function update_ip(state = initialState, action) {
	const message = action.message;

	if (message["status"] == "success") {
		var { ip_id, ip_type, comment } = message;

		for (var each_ip of state.data) {
			if (each_ip.ip_id == ip_id) {
				var new_state = JSON.parse(JSON.stringify(state));

				for (var each_new_ip of new_state.data) {
					if (each_new_ip.ip_id == ip_id) {
						each_new_ip.comment = comment;
						break;
					}
				}

				return new_state;
			}
		}

		return state;
	} else {
		console.error(message);
		/* TODO: add error handling */
	}

}

function ip_reduce(state = initialState, action) {
	if (!action.hasOwnProperty('message')) {
		return state
	}

	else {
		if (action.message && action.current_project_uuid !== action.message.project_uuid) { return state; }
		else {
			switch (action.type) {
				case CREATE_IP:
					return create_ip(state, action);
				case DELETE_IP:
					return delete_ip(state, action);
				case RENEW_IPS:
					return renew_ips(state, action);
				case UPDATE_IP:
					return update_ip(state, action);
				default:
					return state;
			}
		}
	}
}



export default ip_reduce
