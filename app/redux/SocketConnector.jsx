import io from 'socket.io-client';

var connections = {};


class Connector {

    constructor(name="") {
        if (connections.hasOwnProperty(name)) {
            return connections[name];
        }
        else {
            this.name = name;
            this.socketio = io("http://127.0.0.1:5000/" + name);  
            connections[name] = this.socketio;
        }
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

    close() {
        this.socketio.close();
    }

}

export default Connector;
