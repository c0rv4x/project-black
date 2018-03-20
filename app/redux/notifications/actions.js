import _ from "lodash";

import {
    NOTIFICATION_CLEAR,
    NOTIFICATION_DISMISS,
    NOTIFICATION_SHOW,
    NotificationType,
} from "./constants";

export { NotificationType };

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function showNotification(options = {}) {
    return (dispatch, getState) => {
        const {message = ""} = options;
        const {header = ""} = options;
        const {type = NotificationType.INFO} = options;
        const {id = guid()} = options;
        const {dismissAfter = 2500000} = options;

        const showPayload = {message, header, type, id};
        dispatch({type : NOTIFICATION_SHOW, payload : showPayload});

        if(_.isNumber(dismissAfter)) {
            setTimeout(() => {
                dispatch(dismissNotification(id));
            }, dismissAfter);
        }
    }
}

export function dismissNotification(id) {
    return {
        type : NOTIFICATION_DISMISS,
        payload : {id}
    };
}

export function clearAllNotifications() {
    return {
        type : NOTIFICATION_CLEAR,
    };
}