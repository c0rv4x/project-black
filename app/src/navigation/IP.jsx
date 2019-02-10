import React from 'react'
import PropTypes from 'prop-types';

import IPPage from '../ip_verbose/components/MainAccumulatorWrapper.jsx'

import IPsSocketioEventsSubsriber from '../redux/ips/IPsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../redux/tasks/TasksSocketioEventsSubsriber'
import FilesSocketioEventsSubsriber from '../redux/files/FilesSocketioEventsSubscriber'

import { fetchProjects } from '../redux/projects/actions.js'
import { requestSingleIP } from '../redux/ips/actions.js'
import { setProjectUuid } from '../redux/project_uuid/actions.js'
import { requestTasks } from '../redux/tasks/actions.js'

class IP extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const project_uuid = this.props.match.params.project_uuid;
        const ip_address = this.props.match.params.ip_address;
        var mainStore = this.context.store;

        mainStore.dispatch(setProjectUuid(project_uuid));

        mainStore.dispatch(fetchProjects());
        mainStore.dispatch(requestSingleIP(project_uuid, ip_address));
        this.ipsSubscriber = new IPsSocketioEventsSubsriber(mainStore, project_uuid, ip_address);
        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore, project_uuid);
        mainStore.dispatch(requestTasks());

        this.filesSubscriber = new FilesSocketioEventsSubsriber(mainStore, project_uuid, ip_address);        
    }

    render() {
        return (
            <IPPage {...this.props} />
        )
    } 

    componentWillUnmount() {
        this.projectsSubscriber.close();
        this.ipsSubscriber.close();
        this.tasksSubscriber.close();
        this.filesSubscriber.close();    
    }       
}

IP.contextTypes = {
    store: PropTypes.object
}

export default IP;