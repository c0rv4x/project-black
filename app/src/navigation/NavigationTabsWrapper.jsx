import React from 'react'
import PropTypes from 'prop-types';

import NavigationTabs from './NavigationTabs.jsx'

import ProjectsSocketioEventsSubscriber from '../redux/projects/ProjectsSocketioEventsSubscriber'
import IPsSocketioEventsSubsriber from '../redux/ips/IPsSocketioEventsSubscriber'
import HostsSocketioEventsSubsriber from '../redux/hosts/HostsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../redux/tasks/TasksSocketioEventsSubsriber'
import NotificationsSocketioEventsSubscriber from '../redux/notifications/NotificationsSocketioEventsSubscriber'

import { fetchProjects } from '../redux/projects/actions.js'
import { requestIPs } from '../redux/ips/actions.js'
import { requestHosts } from '../redux/hosts/actions.js'
import { setProjectUuid } from '../redux/project_uuid/actions.js'
import { requestTasks } from '../redux/tasks/actions.js'
import { requestCountScans } from '../redux/scans/actions.js'
import { requestCountFiles } from '../redux/files/actions.js'


class NavigationTabsWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const project_uuid = this.props.match.params.project_uuid;
        var mainStore = this.context.store;

        mainStore.dispatch(setProjectUuid(project_uuid));

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore, project_uuid);
        mainStore.dispatch(fetchProjects());       

        this.ipsSubscriber = new IPsSocketioEventsSubsriber(mainStore, project_uuid);
        mainStore.dispatch(requestIPs(project_uuid));

        this.hostsSubscriber = new HostsSocketioEventsSubsriber(mainStore, project_uuid);
        mainStore.dispatch(requestHosts(project_uuid));

        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore, project_uuid);
        mainStore.dispatch(requestTasks());

        mainStore.dispatch(requestCountScans());

        mainStore.dispatch(requestCountFiles());

        this.notificationsSubscriber = new NotificationsSocketioEventsSubscriber(mainStore, project_uuid);
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
        this.notificationsSubscriber.close();
    }
}

NavigationTabsWrapper.contextTypes = {
    store: PropTypes.object
}

export default NavigationTabsWrapper;