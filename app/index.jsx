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

import ProjectMain from './projects_list/containers/ProjectsMain.jsx'

let store = createStore(project_reduce)

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
                            <Route exact path="/" component={ProjectMain} />
                            <Route exact path="/project/:project_name" component={ProjectMain} />
                        </div>
                    </div>
                </Router>            
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));
