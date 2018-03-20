import {
    NOTIFICATION_CLEAR,
    NOTIFICATION_DISMISS,
    NOTIFICATION_SHOW,
} from "./constants";

const initialState = [];

function filterNotifications(notifications, id) {
    return notifications.filter(notification => notification.id !== id);
}

export function showNotification(state, payload) {
    const filteredNotifications = filterNotifications(state, payload.id);
    return [payload, ...filteredNotifications];
}

export function dismissNotification(state, payload) {
    return filterNotifications(state, payload.id);
}

export function clearNotifications(state, payload) {
    return [];
}

function notifications_reduce(state = [], action) {
	switch (action.type) {
		case NOTIFICATION_SHOW:
            return showNotification(state, action);
        case NOTIFICATION_DISMISS:
            return dismissNotification(state, action);
        case NOTIFICATION_CLEAR:
			return showNotification(state, action);                        
		default:
			return state;
	}
};


export default notifications_reduce;
