import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import classnames from 'classnames';

import { Provider } from 'react-redux'

import rdcs from './common/reducers.js';

import ProjectsMainComponentWrapper from './projects_list/components/ProjectsMainComponentWrapper.js';
import ProjectsDetailsWrapper from './project_details/components/ProjectDetailsWrapper.js';

import { createStore } from 'redux';

import ScopesSocketioEventsSubsriber from './common/scopes/ScopesSocketioEventsSubsriber';
import ProjectsSocketioEventsSubscriber from './common/projects/ProjectsSocketioEventsSubscriber';



let store = createStore(rdcs);
const projectsSubscriber = new ProjectsSocketioEventsSubscriber(store);
const scopesSubscriber = new ScopesSocketioEventsSubsriber(store);


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
                                <Route exact path="/project/:project_name" component={ProjectsDetailsWrapper} />
                            </div>
                        </div>
                    </Router>            
                </div>
            </Provider>
        );
    }
}

render(<App/>, document.getElementById('app'));
