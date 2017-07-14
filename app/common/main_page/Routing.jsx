import React from 'react'
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'

import { Provider } from 'react-redux'

import { createStore } from 'redux'
import { combineReducers } from 'redux'

import rdcs from '../../redux/reducers.js'
import project_reduce from '../../redux/projects/reducers';

import ProjectsSocketioEventsSubscriber from '../../redux/projects/ProjectsSocketioEventsSubscriber'
import ScopesSocketioEventsSubsriber from '../../redux/scopes/ScopesSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from '../../redux/tasks/TasksSocketioEventsSubsriber'
import ScansSocketioEventsSubsriber from '../../redux/scans/ScansSocketioEventsSubscriber'
import FilesSocketioEventsSubsriber from '../../redux/files/FilesSocketioEventsSubscriber'

import ProjectsMainComponentWrapper from '../../projects_list/components/ProjectsMainComponentWrapper.js'
import ProjectsDetailsWrapper from '../../ips_list/components/ProjectDetailsWrapper.js'

import NavigationTabs from './NavigationTabs.jsx'
import HostPage from '../../host_verbose/components/MainAccumulatorWrapper.jsx'


var mainStore = createStore(rdcs);

class NavigationTabsWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore);
        this.scopesSubscriber = new ScopesSocketioEventsSubsriber(mainStore);
        this.tasksSubscriber = new TasksSocketioEventsSubsriber(mainStore);
        this.scansSubscriber = new ScansSocketioEventsSubsriber(mainStore);
        this.filesSubscriber = new FilesSocketioEventsSubsriber(mainStore);        
    }

    render() {
        return (
            <Provider store={mainStore}>
                <NavigationTabs {...this.props} />
            </Provider>
        )
    }

    componentWillUnmount() {
        this.projectsSubscriber.close();
        this.scopesSubscriber.close();
        this.tasksSubscriber.close();
        this.scansSubscriber.close();
        this.filesSubscriber.close();
    }
}

class Projects extends React.Component {
    constructor(props) {
        super(props);

        this.projectsSubscriber = new ProjectsSocketioEventsSubscriber(mainStore);        
    }

    render() {
        return (
            <Provider store={mainStore}>
                <ProjectsMainComponentWrapper {...this.props} />
            </Provider>
        )
    } 
    componentWillUnmount() {
        this.projectsSubscriber.close();
    }       
}

class Routing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/"
                           component={Projects} />
                    <Route exact path="/project/:project_name" 
                           component={NavigationTabsWrapper} />
                    <Route exact path="/project/:project_name/host/:hostname" 
                           component={HostPage} />                           
                </div>
            </Router> 
        )
    }
}

export default Routing;
