import React from 'react'
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'

import { connect } from 'react-redux'

import Notifications from '../common/notifications/Notifications.jsx';

import ProjectsSocketioEventsSubscriber from '../redux/projects/ProjectsSocketioEventsSubscriber'
import IPsSocketioEventsSubsriber from '../redux/ips/IPsSocketioEventsSubscriber'
import HostsSocketioEventsSubsriber from '../redux/hosts/HostsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../redux/tasks/TasksSocketioEventsSubsriber'
import ScansSocketioEventsSubsriber from '../redux/scans/ScansSocketioEventsSubscriber'
import FilesSocketioEventsSubsriber from '../redux/files/FilesSocketioEventsSubscriber'
import NotificationsSocketioEventsSubscriber from '../redux/notifications/NotificationsSocketioEventsSubscriber'
import ScopesSocketioEventsSubscriber from '../redux/scopes/ScopesSocketioEventsSubscriber'

import ProjectsMainComponentWrapper from '../projects_list/components/ProjectsMainComponentWrapper.js'
import ProjectsDetailsWrapper from '../ips_list/components/ProjectDetailsWrapper.js'

import NavigationTabs from './NavigationTabs.jsx'
import HostPage from '../host_verbose/components/MainAccumulatorWrapper.jsx'
import IPPage from '../ip_verbose/components/MainAccumulatorWrapper.jsx'
import DirsaerchPage from '../dirsearch_tables/components/MainAccumulatorWrapper.jsx'

import NavigationTabsWrapper from './NavigationTabsWrapper.jsx'
import Projects from './Projects.jsx'
import Host from './Host.jsx'
import IP from './IP.jsx'
import DirsearchWrapper from './DirsearchWrapper.jsx'


class Routing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {notifications} = this.props;

        return (
            <Router>           
                <div>
                    <Notifications store={this.context.store} />
                    <Route exact path="/"
                           component={Projects} />
                    <Route exact path="/project/:project_uuid" 
                           component={NavigationTabsWrapper} />
                    <Route exact path="/project/:project_uuid/dirsearch"
                           component={DirsearchWrapper} />
                    <Route exact path="/project/:project_uuid/host/:hostname" 
                           component={Host} />  
                    <Route exact path="/project/:project_uuid/ip/:ip_address" 
                           component={IP} />                                                      
                </div>
            </Router>
        )
    }
}

Routing.contextTypes = {
    store: React.PropTypes.object
}

export default connect(
  state => ({ notifications: state.notifications })
)(Routing);
