import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import classnames from 'classnames';

import { createStore } from 'redux';
import project_reduce from './common/redux/reducers';

import ProjectsEventsSubsriber from './common/ProjectsSocketioEventsSubscriber';
import ProjectsMainComponent from './projects_list/components/ProjectsMainComponent.js'


let store = createStore(project_reduce);
let test = new ProjectsEventsSubsriber(store);
test.basic_events_registration();


class App extends React.Component {
    render () {
        return (
                <div className="container">
                    <br/>
                    <Router>
                        <div>
                            <div className={classnames("header", "clearfix")}>
                                <Link to="/"><h1>Project Black</h1></Link>
                            </div>
                            <hr/>
                            <div>
                                <Route exact path="/" component={ProjectsMainComponent} />
                                <Route exact path="/project/:project_name" component={ProjectsMainComponent} />
                            </div>
                        </div>
                    </Router>            
                </div>
        );
    }
}

render(<App/>, document.getElementById('app'));
