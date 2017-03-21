import io from 'socket.io-client';


class Connector {

    constructor() {
        this.socketio = io("http://127.0.0.1:5000/");
    }

    after_connected(callback) {
        this.socketio.on('connect', () => {
            callback();
        });
    }

    listen(eventName, callback) {
    	this.socketio.on(eventName, callback);
    }

    emit(eventName, message=null) {
    	if (message != null) {
	        this.socketio.emit(eventName, message);
    	} 
    	else {
	        this.socketio.emit(eventName);
    	}
    }

}

export default Connector;
