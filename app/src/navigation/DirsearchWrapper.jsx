import React from 'react'
import PropTypes from 'prop-types';

import DirsaerchPage from '../dirsearch_tables/components/MainAccumulatorWrapper.jsx'

import IPsSocketioEventsSubsriber from '../redux/ips/IPsSocketioEventsSubscriber'
import HostsSocketioEventsSubsriber from '../redux/hosts/HostsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../redux/tasks/TasksSocketioEventsSubsriber'
import ScansSocketioEventsSubsriber from '../redux/scans/ScansSocketioEventsSubscriber'
import FilesSocketioEventsSubsriber from '../redux/files/FilesSocketioEventsSubscriber'

import { fetchProjects } from '../redux/projects/actions.js'
import { setProjectUuid } from '../redux/project_uuid/actions.js'
import { requestTasks } from '../redux/tasks/actions.js'

class DirsearchWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const project_uuid = this.props.match.params.project_uuid;
        var mainStore = this.context.store;

        mainStore.dispatch(setProjectUuid(project_uuid));

        mainStore.dispatch(fetchProjects());
        this.ipsSubscriber = new IPsSocketioEventsSubsriber(mainStore, project_uuid, null, {'files': ['%']}, 4);
        this.hostsSubscriber = new HostsSocketioEventsSubsriber(mainStore, project_uuid, null, {'files': ['%']}, 4);

        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore, project_uuid);
        mainStore.dispatch(requestTasks());

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
    store: PropTypes.object
}

export default DirsearchWrapper;