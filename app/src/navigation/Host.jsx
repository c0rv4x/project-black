import React from 'react'

import HostPage from '../host_verbose/components/MainAccumulatorWrapper.jsx'

import ProjectsSocketioEventsSubscriber from '../redux/projects/ProjectsSocketioEventsSubscriber'
import HostsSocketioEventsSubsriber from '../redux/hosts/HostsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../redux/tasks/TasksSocketioEventsSubsriber'
import ScansSocketioEventsSubsriber from '../redux/scans/ScansSocketioEventsSubscriber'
import FilesSocketioEventsSubsriber from '../redux/files/FilesSocketioEventsSubscriber'
import CredsSocketioEventsSubscriber from '../redux/creds/CredsSocketioEventsSubscriber'


class Host extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const project_uuid = this.props.match.params.project_uuid;
        const hostname = this.props.match.params.hostname;        
        var mainStore = this.context.store;

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore, project_uuid);
        this.hostsSubscriber = new HostsSocketioEventsSubsriber(mainStore, project_uuid, hostname);
        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore, project_uuid);
        this.scansSubscriber = new ScansSocketioEventsSubsriber(mainStore, project_uuid);
        this.filesSubscriber = new FilesSocketioEventsSubsriber(mainStore, project_uuid, hostname);        
        this.credsSubscriber = new CredsSocketioEventsSubscriber(mainStore, project_uuid);
    }

    render() {
        return (
            <HostPage {...this.props} />
        )
    } 
    componentWillUnmount() {
        this.projectsSubscriber.close();
        this.hostsSubscriber.close();
        this.tasksSubscriber.close();
        this.scansSubscriber.close();
        this.filesSubscriber.close();        
        this.credsSubscriber.close();    
    }       
}

Host.contextTypes = {
    store: React.PropTypes.object
}

export default Host;