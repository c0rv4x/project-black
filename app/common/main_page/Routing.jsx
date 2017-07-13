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


mainStore = createStore(rdcs);

class NavigationTabsWrapper extends React.Component {
    constructor(props) {
        super(props);

        const projectsSubscriber = new ProjectsSocketioEventsSubscriber(this.mainStore);
        const scopesSubscriber = new ScopesSocketioEventsSubsriber(this.mainStore);
        const tasksSubscriber = new TasksSocketioEventsSubsriber(this.mainStore);
        const scansSubscriber = new ScansSocketioEventsSubsriber(this.mainStore);
        const filesSubscriber = new FilesSocketioEventsSubsriber(this.mainStore);        
    }

    render() {
        return (
            <Provider store={this.mainStore}>
                <NavigationTabs {...this.props} />
            </Provider>
        )
    }
}

class Projects extends React.Component {
    constructor(props) {
        super(props);

        this.projectStore = createStore(combineReducers({
            projects: project_reduce
        }));
        const projectsSubscriber = new ProjectsSocketioEventsSubscriber(this.projectStore);        
    }

    render() {
        return (
            <Provider store={this.projectStore}>
                <ProjectsMainComponentWrapper {...this.props} />
            </Provider>
        )
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
