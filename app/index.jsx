import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import classnames from 'classnames';

import { createStore } from 'redux';
import { Provider } from 'react-redux'

import project_reduce from './common/redux/reducers';
import ProjectsEventsSubsriber from './common/ProjectsSocketioEventsSubscriber';
import ProjectsMainComponentWrapper from './projects_list/components/ProjectsMainComponentWrapper.js'


let store = createStore(project_reduce);
let test = new ProjectsEventsSubsriber(store);
test.basic_events_registration();


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
                                <Route exact path="/project/:project_name" component={ProjectsMainComponentWrapper} />
                            </div>
                        </div>
                    </Router>            
                </div>
            </Provider>
        );
    }
}

render(<App/>, document.getElementById('app'));
