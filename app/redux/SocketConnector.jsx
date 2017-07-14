import io from 'socket.io-client';

var connections = {};


class Connector {

    constructor(name="") {
        if (connections.hasOwnProperty(name)) {
            return connections[name];
        }
        else {
            this.name = name;
            this.socketio = io("http://" + location.host + "/" + name);  
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
        connections[this.name].close();
        delete connections[this.name];
    }

}

export default Connector;
