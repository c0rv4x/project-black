import DirsaerchPage from '../dirsearch_tables/components/MainAccumulatorWrapper.jsx'

import ProjectsSocketioEventsSubscriber from '../redux/projects/ProjectsSocketioEventsSubscriber'
import IPsSocketioEventsSubsriber from '../redux/ips/IPsSocketioEventsSubscriber'
import HostsSocketioEventsSubsriber from '../redux/hosts/HostsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../redux/tasks/TasksSocketioEventsSubsriber'
import ScansSocketioEventsSubsriber from '../redux/scans/ScansSocketioEventsSubscriber'
import FilesSocketioEventsSubsriber from '../redux/files/FilesSocketioEventsSubscriber'


class DirsearchWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const project_uuid = this.props.match.params.project_uuid;
        var mainStore = this.context.store;

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore, project_uuid);
        this.ipsSubscriber = new IPsSocketioEventsSubsriber(mainStore, project_uuid, null, {'files': ['%']}, 4);
        this.hostsSubscriber = new HostsSocketioEventsSubsriber(mainStore, project_uuid, null, {'files': ['%']}, 4);
        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore, project_uuid);
        this.scansSubscriber = new ScansSocketioEventsSubsriber(mainStore, project_uuid);
        this.filesSubscriber = new FilesSocketioEventsSubsriber(mainStore, project_uuid);        
    }

    render() {
        return (
            <DirsaerchPage {...this.props} />
        )
    }

    componentWillUnmount() {
        this.projectsSubscriber.close();
        this.ipsSubscriber.close();
        this.hostsSubscriber.close();
        this.tasksSubscriber.close();
        this.scansSubscriber.close();
        this.filesSubscriber.close();        
    }     
}

DirsearchWrapper.contextTypes = {
    store: React.PropTypes.object
}

export default DirsearchWrapper;