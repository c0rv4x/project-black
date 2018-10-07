import Connector from '../SocketConnector.jsx';


class FilesSocketioEventsEmitter {
    /* Singleton class for managing events subscription for the files */
    constructor() {
        this.connector = new Connector('files');
    }

    renewFiles(project_uuid, hostname) {
        this.connector.emit('files:all:get', {
        	"project_uuid": project_uuid,
        	"hostname": hostname
        });
    }

    renewSingleHost(project_uuid, hostname) {
        this.connector.emit('files:all:get:single', {
            "project_uuid": project_uuid,
            "hostname": hostname
        });
    }

    renewCount(project_uuid) {
        this.connector.emit('files:count:get', {
            "project_uuid": project_uuid
        });
    }

    requestStatsHost(project_uuid, host_ids) {
        this.connector.emit('files:stats:get:host', {
            "project_uuid": project_uuid,
            "host_ids": host_ids
        });
    }

    requestStatsIPs(project_uuid, ip_ids) {
        this.connector.emit('files:stats:get:ip', {
            "project_uuid": project_uuid,
            "ip_ids": ip_ids
        });
    }  
    
    requestFilesHosts(project_uuid, host_ids) {
        console.log(host_ids);
        this.connector.emit('files:get:hosts', {
            "project_uuid": project_uuid,
            "host_ids": host_ids
        });        
    }

    requestFilesIps(project_uuid, ip_ids) {
        this.connector.emit('files:get:ips', {
            "project_uuid": project_uuid,
            "ip_ids": ip_ids
        });        
    }
}

export default FilesSocketioEventsEmitter;
