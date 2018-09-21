import React from 'react'

import NavigationTabs from './NavigationTabs.jsx'

import ProjectsSocketioEventsSubscriber from '../redux/projects/ProjectsSocketioEventsSubscriber'
import IPsSocketioEventsSubsriber from '../redux/ips/IPsSocketioEventsSubscriber'
import HostsSocketioEventsSubsriber from '../redux/hosts/HostsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../redux/tasks/TasksSocketioEventsSubsriber'
import ScansSocketioEventsSubsriber from '../redux/scans/ScansSocketioEventsSubscriber'
import FilesSocketioEventsSubsriber from '../redux/files/FilesSocketioEventsSubscriber'
import NotificationsSocketioEventsSubscriber from '../redux/notifications/NotificationsSocketioEventsSubscriber'
import ScopesSocketioEventsSubscriber from '../redux/scopes/ScopesSocketioEventsSubscriber'


class NavigationTabsWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const project_uuid = this.props.match.params.project_uuid;
        var mainStore = this.context.store;

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore, project_uuid);
        this.ipsSubscriber = new IPsSocketioEventsSubsriber(mainStore, project_uuid);
        this.hostsSubscriber = new HostsSocketioEventsSubsriber(mainStore, project_uuid);
        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore, project_uuid);
        this.scansSubscriber = new ScansSocketioEventsSubsriber(mainStore, project_uuid);
        this.filesSubscriber = new FilesSocketioEventsSubsriber(mainStore, project_uuid);   
        this.notificationsSubscriber = new NotificationsSocketioEventsSubscriber(mainStore, project_uuid);
        this.scopesSubscriber = new ScopesSocketioEventsSubscriber(mainStore, project_uuid);
    }

    render() {
        return (
            <NavigationTabs {...this.props} />
        )
    }

    componentWillUnmount() {
        this.projectsSubscriber.close();
        this.ipsSubscriber.close();
        this.hostsSubscriber.close();
        this.tasksSubscriber.close();
        this.scansSubscriber.close();
        this.filesSubscriber.close();
        this.notificationsSubscriber.close();
        this.scopesSubscriber.close();
    }
}

NavigationTabsWrapper.contextTypes = {
    store: React.PropTypes.object
}

export default NavigationTabsWrapper;