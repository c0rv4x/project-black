import React from 'react';
import {render} from 'react-dom';

import { Provider } from 'react-redux'

import rdcs from './common/reducers.js';
import { createStore } from 'redux';

import ProjectsSocketioEventsSubscriber from './common/projects/ProjectsSocketioEventsSubscriber';
import ScopesSocketioEventsSubsriber from './common/scopes/ScopesSocketioEventsSubscriber';
import TasksSocketioEventsSubsriber from './common/tasks/TasksSocketioEventsSubsriber';
import ScansSocketioEventsSubsriber from './common/scans/ScansSocketioEventsSubscriber';

import Routing from './Routing.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.store = createStore(rdcs);
        const projectsSubscriber = new ProjectsSocketioEventsSubscriber(this.store);
        const scopesSubscriber = new ScopesSocketioEventsSubsriber(this.store);
        const tasksSubscriber = new TasksSocketioEventsSubsriber(this.store);
        const scansSubscriber = new ScansSocketioEventsSubsriber(this.store);
    }

    render () {
        return (
            <Provider store={this.store}>
                <div className="container">
                    <Routing />
                </div>
            </Provider>
        );
    }
}

render(<App/>, document.getElementById('app'));
