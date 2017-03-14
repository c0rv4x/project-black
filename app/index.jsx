import React from 'react';
import {render} from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import classnames from 'classnames';


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
                            <Route exact path="/" component={ProjectList} />
                            <Route exact path="/project/:project_name" component={ProjectDetails} />
                        </div>
                    </div>
                </Router>            
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));
