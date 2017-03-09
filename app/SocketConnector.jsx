import io from 'socket.io-client';

let instance = null;

class Connector {

    constructor() {
        if(!instance){
              instance = this;
        }

        this.socketio = io("http://127.0.0.1:5000");

        return instance;
    }

    listen(eventName, callback) {
    	this.socketio.on(eventName, callback);
    }

    emit(eventName, message=null) {
    	if (message != null) {
    		console.log(eventName, message);
	        this.socketio.emit(eventName, message);
    	} 
    	else {
	        this.socketio.emit(eventName);
    	}
    }

}

export default Connector;