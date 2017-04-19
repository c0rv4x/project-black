import React from 'react'
import {render} from 'react-dom'

import { Provider } from 'react-redux'

import { createStore } from 'redux'

import rdcs from './redux/reducers.js'
import ProjectsSocketioEventsSubscriber from './redux/projects/ProjectsSocketioEventsSubscriber'
import ScopesSocketioEventsSubsriber from './redux/scopes/ScopesSocketioEventsSubscriber'
import TasksSocketioEventsSubsriber from './redux/tasks/TasksSocketioEventsSubsriber'
import ScansSocketioEventsSubsriber from './redux/scans/ScansSocketioEventsSubscriber'
import FilesSocketioEventsSubsriber from './redux/files/FilesSocketioEventsSubscriber'

import Routing from './common/main_page/Routing.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.store = createStore(rdcs);
        const projectsSubscriber = new ProjectsSocketioEventsSubscriber(this.store);
        const scopesSubscriber = new ScopesSocketioEventsSubsriber(this.store);
        const tasksSubscriber = new TasksSocketioEventsSubsriber(this.store);
        const scansSubscriber = new ScansSocketioEventsSubsriber(this.store);
        const filesSubscriber = new FilesSocketioEventsSubsriber(this.store);
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
