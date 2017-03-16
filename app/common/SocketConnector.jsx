import io from 'socket.io-client';

let instance = null;

class Connector {

    constructor() {
        if(!instance){
              instance = this;
        }
        this.connected = false;

        this.registered_event_names = [];
        this.socketio = io("http://127.0.0.1:5000/");

        return instance;
    }

    after_connected(callback) {
        if (!this.connected) {
            this.socketio.on('connect', () => {
                callback();
            });
        }
        else {
            callback()
        }
    }

    listen(eventName, callback) {
        this.registered_event_names.push(eventName);
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
