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
            connections[name] = this;
        }
    }

    after_connected(callback) {
        if (!this.socketio.connected) {
            this.socketio.on('connect', () => {
                callback();
            });            
        }
        else {
            callback();
        }
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
        console.log("closing connetor:", this.name)
        connections[this.name].socketio.close();
        delete connections[this.name];
    }

}

export default Connector;
