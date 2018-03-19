import Notifications from 'react-notification-system-redux'


class Notifier {

	constructor(store) {
		this.store = store;
	}

	error(title, text) {
		this.store.dispatch(Notifications.error({
			title: title,
			text: text
		}));
	}

	success(title, text) {
		this.store.dispatch(Notifications.success({
			title: title,
			text: text
		}));		
	}

}

export default Notifier;