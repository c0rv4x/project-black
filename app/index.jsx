import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import { Provider } from 'react-redux'

import rdcs from './common/reducers.js';

import ProjectsMainComponentWrapper from './projects_list/components/ProjectsMainComponentWrapper.js';
import ProjectsDetailsWrapper from './project_details/components/ProjectDetailsWrapper.js';
import ScopeSetupWrapper from './scope_setup/components/ScopeSetupWrapper.js';


import { createStore } from 'redux';

import ProjectsSocketioEventsSubscriber from './common/projects/ProjectsSocketioEventsSubscriber';
import ScopesSocketioEventsSubsriber from './common/scopes/ScopesSocketioEventsSubscriber';
import TasksSocketioEventsSubsriber from './common/tasks/TasksSocketioEventsSubsriber';
import ScansSocketioEventsSubsriber from './common/scans/ScansSocketioEventsSubscriber';


let store = createStore(rdcs);
const projectsSubscriber = new ProjectsSocketioEventsSubscriber(store);
const scopesSubscriber = new ScopesSocketioEventsSubsriber(store);
const tasksSubscriber = new TasksSocketioEventsSubsriber(store);
const scansSubscriber = new ScansSocketioEventsSubsriber(store);


class App extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <div className="container">
                    <br/>
                    <Router>
                        <div>
                            <div>
                                <Link to="/"><h1>Project Black</h1></Link>
                            </div>
                            <hr/>
                            <div>
                                <Route exact path="/"
                                       component={ProjectsMainComponentWrapper}/>
                                <Route exact path="/project/:project_name" 
                                       component={ScopeSetupWrapper} />
                            </div>
                        </div>
                    </Router>            
                </div>
            </Provider>
        );
    }
}

render(<App/>, document.getElementById('app'));
