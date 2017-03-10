let instance = null;

class Connector {

    constructor() {
        if(!instance){
              instance = this;
        }

        return instance;
    }

}

export default Connector;