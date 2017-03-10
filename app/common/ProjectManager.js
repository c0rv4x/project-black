let instance = null;

class ProjectManager {

    constructor() {
        if(!instance){
              instance = this;
        }

        return instance;
    }

}

export default ProjectManager;