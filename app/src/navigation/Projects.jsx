import React from 'react'
import PropTypes from 'prop-types';

import ProjectsMainComponentWrapper from '../projects_list/components/ProjectsMainComponentWrapper.js'

import ProjectsSocketioEventsSubscriber from '../redux/projects/ProjectsSocketioEventsSubscriber'
import NotificationsSocketioEventsSubscriber from '../redux/notifications/NotificationsSocketioEventsSubscriber'

import { fetchProjects } from '../redux/projects/actions.js'

class Projects extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var mainStore = this.context.store;

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore); 
        mainStore.dispatch(fetchProjects());       
        this.notificationsSubscriber = new NotificationsSocketioEventsSubscriber(mainStore);        
    }

    render() {
        return (
            <ProjectsMainComponentWrapper {...this.props} />
        )
    } 
    componentWillUnmount() {
        this.projectsSubscriber.close();
        this.notificationsSubscriber.close();
    }       
}

Projects.contextTypes = {
    store: PropTypes.object
}

export default Projects;