import { NOTIF_SEND, NOTIF_DISMISS, NOTIF_CLEAR } from './actions';

export default function notifs(domain = [], action) {
  if (!action || !action.type) return domain;

  switch (action.type) {
    case NOTIF_SEND:
      return [action.payload, ...domain.filter(({ id }) => id !== action.payload.id)];
    case NOTIF_DISMISS:
      return domain.filter(notif =>
          notif.id !== action.payload
      );
    case NOTIF_CLEAR:
      return [];
    default:
      return domain;
  }
}