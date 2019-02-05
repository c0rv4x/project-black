const objectAssign = require('object-assign');

export const NOTIF_SEND = 'NOTIF_SEND';
export const NOTIF_DISMISS = 'NOTIF_DISMISS';
export const NOTIF_CLEAR = 'NOTIF_CLEAR';

/**
 * Publish a notification,
 * - if `dismissAfter` was set, the notification will be auto dismissed after the given period.
 * - if id wasn't specified, a time based id will be generated.``
 */
export function notificationSend(notif) {
  const payload = objectAssign({}, notif);
  if (!payload.id) {
    payload.id = new Date().getTime();
  }
  return dispatch => {
    dispatch({ type: NOTIF_SEND, payload });

    if (payload.dismissAfter) {
      setTimeout(() => {
        dispatch({
          type: NOTIF_DISMISS,
          payload: payload.id,
        });
      }, payload.dismissAfter);
    }
  };
}

export function notifySuccess(message) {
  return notificationSend({
    message: message,
    kind: 'success',
    dismissAfter: 5000
  });
}

export function notifyError(message) {
  return notificationSend({
    message: message,
    kind: 'error',
    dismissAfter: 15000
  });
}

/**
 * Dismiss a notification by the given id.
 */
export function notifDismiss(id) {
  return { type: NOTIF_DISMISS, payload: id };
}

/**
 * Clear all notifications
 */
export function notifClear() {
  return { type: NOTIF_CLEAR };
}