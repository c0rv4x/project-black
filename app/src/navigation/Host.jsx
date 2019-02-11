import React from 'react'
import PropTypes from 'prop-types';

import HostPage from '../host_verbose/components/HostVerboseWrapper.jsx'

import HostsSocketioEventsSubsriber from '../redux/hosts/HostsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../redux/tasks/TasksSocketioEventsSubsriber'

import { fetchProjects } from '../redux/projects/actions.js'
import { setProjectUuid } from '../redux/project_uuid/actions.js'
import { requestSingleHost } from '../redux/hosts/actions.js'
import { requestTasks } from '../redux/tasks/actions.js'
import { requestCountFiles } from '../redux/files/actions.js'

class Host extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const project_uuid = this.props.match.params.project_uuid;
        const hostname = this.props.match.params.hostname;        
        var mainStore = this.context.store;

        mainStore.dispatch(setProjectUuid(project_uuid));

        mainStore.dispatch(fetchProjects());
        mainStore.dispatch(requestSingleHost(project_uuid, hostname));
        this.hostsSubscriber = new HostsSocketioEventsSubsriber(mainStore, project_uuid);
        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore, project_uuid);
        mainStore.dispatch(requestTasks());

        mainStore.dispatch(requestCountFiles());       
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
    }       
}

Host.contextTypes = {
    store: PropTypes.object
}

export default Host;