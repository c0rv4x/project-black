import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import classnames from 'classnames';

import { createStore } from 'redux';
import { Provider } from 'react-redux'

import ProjectsEventsSubsriber from './common/projects/ProjectsSocketioEventsSubscriber';
import ScopesEventsSubsriber from './common/scopes/ScopesSocketioEventsSubsriber';

import rdcs from './common/reducers.js';

import ProjectsMainComponentWrapper from './projects_list/components/ProjectsMainComponentWrapper.js';
import ProjectDetails from './project_details/components/ProjectDetails.jsx';


let store = createStore(rdcs);
let projectsSubcriber = new ProjectsEventsSubsriber(store);
projectsSubcriber.basic_events_registration();


class App extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <div className="container">
                    <br/>
                    <Router>
                        <div>
                            <div className={classnames("header", "clearfix")}>
                                <Link to="/"><h1>Project Black</h1></Link>
                            </div>
                            <hr/>
                            <div>
                                <Route exact path="/" component={ProjectsMainComponentWrapper} />
                                <Route exact path="/project/:project_name" component={ProjectDetails} />
                            </div>
                        </div>
                    </Router>            
                </div>
            </Provider>
        );
    }
}

render(<App/>, document.getElementById('app'));
