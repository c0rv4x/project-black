import React from 'react'
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'

import { connect } from 'react-redux'

import Notifications from 'react-notification-system-redux'


import ProjectsSocketioEventsSubscriber from '../../redux/projects/ProjectsSocketioEventsSubscriber'
import IPsSocketioEventsSubsriber from '../../redux/ips/IPsSocketioEventsSubscriber'
import HostsSocketioEventsSubsriber from '../../redux/hosts/HostsSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../../redux/tasks/TasksSocketioEventsSubsriber'
import ScansSocketioEventsSubsriber from '../../redux/scans/ScansSocketioEventsSubscriber'
import FilesSocketioEventsSubsriber from '../../redux/files/FilesSocketioEventsSubscriber'

import ProjectsMainComponentWrapper from '../../projects_list/components/ProjectsMainComponentWrapper.js'
import ProjectsDetailsWrapper from '../../ips_list/components/ProjectDetailsWrapper.js'

import NavigationTabs from './NavigationTabs.jsx'
import HostPage from '../../host_verbose/components/MainAccumulatorWrapper.jsx'
import IPPage from '../../ip_verbose/components/MainAccumulatorWrapper.jsx'
import DirsaerchPage from '../../dirsearch_tables/components/MainAccumulatorWrapper.jsx'


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
    }
}

NavigationTabsWrapper.contextTypes = {
    store: React.PropTypes.object
}

class Projects extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var mainStore = this.context.store;

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore);        
    }

    render() {
        return (
            <ProjectsMainComponentWrapper {...this.props} />
        )
    } 
    componentWillUnmount() {
        this.projectsSubscriber.close();
    }       
}

Projects.contextTypes = {
    store: React.PropTypes.object
}

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
    }       
}

Host.contextTypes = {
    store: React.PropTypes.object
}

class IP extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const project_uuid = this.props.match.params.project_uuid;
        const ip_address = this.props.match.params.ip_address;
        var mainStore = this.context.store;

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore, project_uuid);
        this.ipsSubscriber = new IPsSocketioEventsSubsriber(mainStore, project_uuid);
        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore, project_uuid);
        this.scansSubscriber = new ScansSocketioEventsSubsriber(mainStore, project_uuid);
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
        this.scansSubscriber.close();
        this.filesSubscriber.close();        
    }       
}

IP.contextTypes = {
    store: React.PropTypes.object
}

class DirsearchWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const project_uuid = this.props.match.params.project_uuid;
        var mainStore = this.context.store;

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore, project_uuid);
        this.hostsSubscriber = new HostsSocketioEventsSubsriber(mainStore, project_uuid, null, {'files': ['%']});
        this.ipsSubscriber = new IPsSocketioEventsSubsriber(mainStore, project_uuid, null, {'files': ['%']});
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

class Routing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {notifications} = this.props;

        return (
            <Router>           
                <div>
                    <Notifications
                        notifications={notifications}
                    />
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
